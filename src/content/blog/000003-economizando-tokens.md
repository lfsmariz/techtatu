---
title: 'Economizando Tokens e Obtendo Bons Resultados'
description: 'Um guia para entender como um RAG opera'
pubDate: 'Nov 15 2025'
heroImage: '../../assets/software-develop.webp'
draft: false
locale: pt-BR
translationKey: 000003-economizando-tokens
---

Conversar, falar, debater e estudar IA hoje em dia virou, na maioria das vezes, uma sopa de letrinhas extremamente densa em vocabulário, mas sem muita profundidade. Não me entenda mal, é louvável a capacidade de compreender, canalizar e aplicar conhecimentos nesse bombardeio de tecnologias, bibliotecas, modelos... Mas vamos respirar um pouco.

Sempre recomendo aos meus mentorados que deem um passo a mais além do que está borbulhando na superfície. MCP, LLM, Tokens, Embeddings, Fine-tuning, Prompt Engineering, Context Window, Zero-shot Learning, Chain-of-Thought, RAG... Parece infinito e talvez seja, reconheçamos nossa finitude e foquemos no próximo passo.

Nos meus estudos, RAG sempre pareceu uma constante em diversos aspectos. Mas sempre caí num conjunto de tutoriais que não me apresentavam mais que um par de palavras bonitas que falavam sem explicar além do que foi dito.

- Processo de Recuperação
- Aumento de dados
- Geração de LLM

## Imaginemos o cenário
> Anacleto é um rapaz muito organizado que registra seus dias num conjunto de diários ~~journaling~~, e Anacleto gostaria muito de ter sua assistente de IA ajudando-o a resumir suas atividades relacionadas à saúde no último ano.

#### Solução inocente:
Enviar todos os journalings junto da pergunta.

#### Problemas:
- Carregar todos os journalings do último ano gastaria muitos tokens.
- Pode trazer muita informação irrelevante, aumentando a chance da IA alucinar.
- Limitações no tamanho do contexto podem resultar em corte de partes importantes do conteúdo enviado.

**P.S.: não existe contexto infinito; sempre será uma combinação de estratégias de windowing e sliding window (mais duas palavrinhas para seu vocabulário).**

#### Solução coerente:
Vamos usar RAG - _Retrieval-Augmented Generation_ - e problema resolvido, escolha um dos tutoriais que mais lhe agradar e ___DONE___. Mas e o próximo passo?

### Passo 1 - Embedding

Diversas vezes representamos dados com outros dados. Isso nos permite fazer maravilhas na computação, desde hashs para verificação de integridade até índices para otimização de buscas.

> Um embedding é uma representação numérica de um texto, no formato de um vetor de números de ponto flutuante.

Mas como gerar um embedding? Essa pergunta tem diversas nuances e teríamos de dar mais um passo, mas para fins de foco vamos apenas usar o ___embeddinggemma___, um modelo pré-treinado com 300M de parâmetros.

```javascript
async function generateEmbeddings(text) {
    const resp = await ollama.embed({
        model: 'embeddinggemma',
        input: text,
    });
    return new Float32Array(resp.embeddings.flat());
}
```

Gerar isso e salvar onde? Podemos usar um Elasticsearch, mas como estou explicando o básico por aqui vamos de SQLite com SQLiteVec. **Sério, ainda me surpreendo o quanto o SQLite é versátil.**

```javascript
const db = new Database("embeddingstest.db");

sqliteVec.load(db);

const { vec_version } = db
  .prepare("SELECT vec_version() AS vec_version;")
  .get();

console.log("vec_version:", vec_version);

db.exec(`
    CREATE VIRTUAL TABLE IF NOT EXISTS embeddings USING vec0(
        id TEXT PRIMARY KEY,
        content TEXT,
        embeddings FLOAT[768]
    );
`);

async function generateEmbeddingsFromJournal() {    
    for (let index = 0; index < 10; index++) {
        const journal = fs.readFileSync(`embeddings/journaling/journal${index}.md`, 'utf8');
        const embeddings = await generateEmbeddings(journal);
        const safeIndex = index.toString();

        db.prepare(`INSERT INTO embeddings(id, content, embeddings) VALUES (?, ?, ?)`).run(safeIndex, journal, embeddings);
    }
}
```

No meu exemplo, utilizei 10 journalings de exemplo falando de diversos temas no formato ___journal${index}.md___; com isso, tenho uma amostragem razoável de contexto para meu modelo __llama3.2__.

### Passo 2 - Recuperando com embedding

A recuperação utilizando embeddings consiste em transformar tanto os textos armazenados quanto a busca do usuário em vetores de números (embeddings). Com esses vetores, é possível medir o quanto eles se parecem uns com os outros realizando uma comparação matemática. O principal método utilizado para medir essa similaridade é a **similaridade de cosseno**.

A similaridade de cosseno calcula o ângulo entre dois vetores no espaço multidimensional: quanto mais próximo de 1, mais parecidos eles são; quanto mais próximo de 0, menos parecidos. Assim, quando queremos buscar textos similares, calculamos o embedding da busca e comparamos com os embeddings salvos, retornando aqueles com maior similaridade.

#### Por que usar essa similaridade?
O grande benefício da similaridade de cosseno é que ela ignora a magnitude (comprimento) do vetor e foca apenas na direção. Em contextos de texto, a magnitude do vetor de embedding pode estar ligada ao tamanho do texto ou à frequência das palavras, não necessariamente ao seu significado.

Ao focar na direção, a métrica garante que um parágrafo curto e bem escrito sobre o tema X seja considerado mais similar a uma pergunta sobre X do que um artigo longo e irrelevante, mesmo que o artigo longo tenha um vetor de maior magnitude.

#### No SQLiteVec fica mais ou menos assim:

```javascript
async function consultSimilarJournals(query, k = 3) {
    const queryEmbeddings = await generateEmbeddings(query);

    const stmt = db.prepare(`
        SELECT id, content, distance
        FROM embeddings
        WHERE embeddings MATCH ?
          AND k = ?
        ORDER BY distance
    `);

    const rows = stmt.all(queryEmbeddings, k);
    return rows;
}
```

Uma vez que fazemos a busca semântica para a pergunta:

> Quais foram as consultas recentes e médicos?

#### Temos o seguinte top 3 de proximidade:

```json
[
  {
    id: '0',
    content: '**Journaling Fake**\n' +
      '================\n' +
      '\n' +
      'Hoje fui ao dentista para fazer uma revisão e cuidar melhor da minha saúde bucal. Foi uma experiência importante para manter meus dentes saudáveis e evitar problemas futuros.\n',
    distance: 0.9737769365310669
  },
  {
    id: '1',
    content: '**Diário de Reflexão**\n' +
      '=====================\n' +
      '\n' +
      'Hoje fui ao médico para investigar um desconforto que estava sentindo na garganta há alguns dias. O médico foi bastante atencioso e me explicou detalhadamente sobre possíveis causas e como proceder com o tratamento.\n' +
      '\n' +
      'Saí da consulta aliviado, sentindo que cuidar da saúde é mesmo fundamental. Aproveitei para refletir sobre como, muitas vezes, deixo pequenos sintomas de lado por conta da correria do dia a dia. Pretendo estar mais atento ao meu corpo e buscar ajuda médica sempre que necessário.',
    distance: 1.0204509496688843
  },
  {
    id: '5',
    content: '**Journaling Fake**\n' +
      '=====================\n' +
      '\n' +
      'Hoje decidi repensar meus hábitos alimentares e focar em escolhas mais saudáveis para meu dia a dia. Incluí mais frutas, verduras e legumes nas refeições e procurei evitar alimentos ultraprocessados. Sinto que investir em uma alimentação equilibrada não só traz benefícios para a saúde física, mas também melhora meu bem-estar e disposição para enfrentar a rotina.\n',
    distance: 1.0411263704299927
  }
]
```

Percebam como a aproximação semântica é eficiente em identificar que o texto sobre dentista/saúde bucal é relevante mesmo sem a palavra **"consulta"** ou **"médico"**.

Além disso, percebam como **"hábitos alimentares saudáveis"** pontua muito bem no nosso exemplo.

### Passo 3 - Agora sim criamos o contexto.

Vamos agora passar apenas o que foi recuperado com um prompt simples do tipo:

```javascript
async function verifyJournal(similarJournals, search) {
    const journal = similarJournals.map(journal => journal.content).join('\n');

    const messages = [
        {
            role: 'system',
            content: `Você é uma ferramenta que responde perguntas baseado no que é informado.`
        },
        {
            role: 'user',
            content: `Baseado no que é informado:
            ${journal}
            
            Responda a pergunta: ${search}`
        }
    ];

    const response = await ollama.chat({
        model: 'llama3.2:latest',
        messages: messages
    });
    return response.message.content; 
}
```

E __Voilà__! Temos uma resposta coerente e eficiente usando menos de 30% dos tokens em média que utilizaríamos em um exemplo carregado com todos os arquivos.

```markdown
Com base nos textos fornecidos, posso identificar duas consultas recentes:

1. **Dentista**: A pessoa foi ao dentista para uma revisão e cuidar melhor da sua saúde bucal.
2. **Médico**: Além disso, a pessoa também visitou um médico para investigar desconfortos na garganta e receber orientações sobre como proceder com o tratamento.
Não há informações específicas sobre outras consultas médicas ou profissionais de saúde mencionadas nos textos fornecidos.
```

## Conclusão

Em resumo, ao utilizar a busca semântica para reduzir o contexto enviado ao modelo, conseguimos respostas precisas e objetivas, ao mesmo tempo em que otimizamos o uso de tokens e recursos computacionais. Isso demonstra como técnicas de recuperação inteligente de informações podem ser grandes aliadas na construção de sistemas mais econômicos e eficientes, sem perder a qualidade das respostas.

### Ou melhor...

Enviar todos os journalings com a mesma pergunta prejudicava minha janela de contexto; imagine que o fluxo de atenção pode se perder com seu viés aleatorizado, temos uma chance do modelo cair em desempenho e eficiência no seu fluxo de resposta. Se você duvida, olhe esse exemplo que testei, para essa janela de contexto de apenas 10 arquivos, e imagine o custo de reexecutar essa consulta por falta de qualidade da resposta.

```javascript
async function verifyAllJournaling(search) {
    let allJournals = "";

    for (let index = 0; index < 10; index++) {
        const journal = fs.readFileSync(`embeddings/journaling/journal${index}.md`, 'utf8');
        allJournals += journal + '\n';
    }

    const messages = [
        {
            role: 'system',
            content: `Você é uma ferramenta que responde perguntas baseado no que é informado.`
        },
        {
            role: 'user',
            content: `Baseado no que é informado:
            ${allJournals}
            
            Responda a pergunta: ${search}`
        }
    ];

    const response = await ollama.chat({
        model: 'llama3.2:latest',
        messages: messages
    });
    return response.message.content; 
}
```

##### Resultado:

```markdown
Não foi possível determinar as consultas recentes 
e médicos de uma pessoa, com base nas informações fornecidas. 
A informação sobre as consultas médicas não está presente nos textos proporcionados.
```

Esse foi um texto apenas para elucidar a camada de embedding do RAG, parte da mágica que utilizamos. Mas lembremos que isso não é bala de prata e nem sempre servirá para o seu propósito específico.

> Em caso de suspeita de low code o Dev deverá ser consultado
>
> - Ministério do Desenvolvimento

<br/>

-----
<br/>
<br/>

##### Código base do artigo: LINK
##### Quer Saber mais sobre a Mentoria me chama no <a href="https://www.linkedin.com/in/luizfilipesmariz/" target="_blank">Linkedin</a>
