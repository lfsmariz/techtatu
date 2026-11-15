---
title: 'Uma conversa sobre réguas num mundo com IA'
description: 'Os perigos de medir errado ou usar uma régua no litoral'
pubDate: 'Jun 06 2026'
heroImage: '../../assets/software-develop.webp'
draft: false
locale: pt-BR
translationKey: 000004-uma-conversa-sobre-metricas
---

Medir é um instinto humano. Queremos saber o quanto crescemos, o quanto produzimos, o quanto vale o nosso trabalho. Mas usar a régua errada pode nos fazer acreditar que o litoral de uma praia tem quilômetros a mais só porque escolhemos medir cada pedrinha. Esse fenômeno, conhecido como **o problema do litoral infinito**, nos ensina algo valioso: a escala da medição muda completamente o resultado. No mundo corporativo, especialmente quando a IA entra em cena, estamos vivendo algo parecido. Empresas estão escolhendo réguas enganosas para medir produtividade, criando distorções que podem custar caro, tanto em dinheiro quanto em sanidade das equipes.

Antes de falar sobre as métricas certas, vamos entender como é fácil cair nessa armadilha. Você já ouviu falar em **Token Maxxing**? Pois é, virou febre no Vale do Silício. A ideia é simples: medir a produtividade de um funcionário pela quantidade de tokens de IA que ele consome. Quanto mais tokens, mais produtivo ele seria. Mas, como veremos, essa régua pode ser tão absurda quanto medir o litoral com uma régua de 1 cm.

---

## O problema do litoral infinito e métricas malucas

Imagine que você é um engenheiro de software e sua empresa decide que a métrica de produtividade será **linhas de código escritas por dia**. O que acontece? Você começa a escrever código verboso, repetitivo, cheio de redundâncias. O sistema fica mais difícil de manter, mas o número de linhas sobe. O indicador fica verde, mas o produto real piora. Isso é a **Lei de Goodhart** em ação: quando uma medida se torna uma meta, ela deixa de ser uma boa medida.

O problema do litoral infinito ilustra isso perfeitamente. Se você medir a costa da Inglaterra com uma régua de 100 km, obtém um valor. Se usar uma régua de 1 km, obtém um valor maior, porque consegue contornar mais enseadas. Com uma régua de 1 metro, o valor explode. A resposta não é única; depende da escala. Da mesma forma, métricas de produtividade podem ser manipuladas pela escolha da "régua".

Agora, acrescente IA à equação. Ferramentas como GitHub Copilot, Claude Code e Codex geram tokens a todo momento. Se a régua escolhida for "consumo de tokens", você estará medindo o barulho, não a qualidade. E pior: incentivará o uso desenfreado, sem critério, gerando uma falsa sensação de produtividade.

---

## Quando a conta chega

O cenário atual mostra que as empresas de IA estão desesperadas para conter prejuízos. A **Anthropic** gasta de US$ 8 a US$ 13,50 para cada dólar de receita, com receita recorrente anualizada de US$ 5 bilhões e gastos de US$ 10 bilhões. Para cortar custos, tentou restringir o Claude Code ao plano Max de US$ 100/mês, mas recuou após reclamações – classificou a mudança como "teste". Agora, começou a cobrar clientes Enterprise por token extra. Houve até caso de conta suspensa por uso excessivo, considerado falso positivo.

A **Microsoft**, por sua vez, migrou o GitHub Copilot para cobrança por tokens a partir de 1º de junho de 2026. O impacto? Clientes podem ver seus custos mensais saltarem de US$ 39 para US$ 5.852 – um aumento de até 150 vezes. A medida visa conter os prejuízos da empresa com IA. Clientes reclamam e alguns já cogitam abandonar agentes de IA.

O **Google** também entrou na dança. Reduziu o preço do plano AI Ultra, mas impôs limites mais rígidos ao AI Pro. Agora, um sistema de créditos baseado na complexidade dos comandos restringe o uso. Usuários chamam a mudança de "golpe", pois um único comando consumiu 13% da cota. As limitações se aplicam a outros produtos de IA, incluindo janelas de cinco horas de uso.

Todas essas mudanças têm um ponto em comum: as empresas estão redirecionando o custo do uso intenso de IA para os clientes, ao mesmo tempo que tentam criar métricas de consumo como forma de monetizar. As perguntas que ficam são: 

>Será que as métricas dos clientes estão adequadas a esses "ajustes" realizados nas formas de cobranças das empresas? Será que estamos usando a régua certa para medir esse cenário?

---

## Token Maxxing: a nova febre corporativa

A coluna de Diogo Cortiz no UOL aborda o "Token Maxxing" como a nova febre no Vale do Silício. A ideia é simples: medir a produtividade de funcionários pelo consumo de tokens de IA. Empresas como Meta, OpenAI e Nvidia já ranqueiam ou incentivam o uso intenso da tecnologia como métrica de desempenho. O autor alerta que essa pressão, sem capacitação ou critérios de qualidade, pode gerar uma ilusão de produtividade, onde o foco é parecer produtivo, não entregar resultados reais.

Isso me lembra de uma analogia: se você mede a produtividade de um escritor pelo número de palavras que ele digita por dia, você não vai gerar o macaco infinito, muito provavelmente só vai criar um gerador de lero-lero. Token Maxxing faz o mesmo com IA. Um funcionário pode gerar milhares de tokens com perguntas inúteis, respostas repetitivas ou mesmo usando a IA para tarefas que não precisam dela. O número sobe, mas o valor entregue cai.

Além disso, essa métrica ignora completamente a qualidade do output. Um token gerado por uma resposta precisa e relevante vale mais do que mil tokens de alucinação. Mas a régua não diferencia. É como medir a qualidade de um prato pelo peso dos ingredientes, sem avaliar o sabor.

---

## Métricas efetivas e arriscadas: frameworks que podem ajudar

Se token maxxing é uma régua furada, o que devemos usar? Felizmente, existem frameworks consolidados que avaliam produtividade e desempenho de forma mais equilibrada. Vamos conhecer três principais: **DORA**, **SPACE** e **DevEx**. Cada um tem seus pontos fortes e fracos, e combiná-los pode trazer uma visão mais completa.

### Framework DORA (DevOps Research and Assessment)

O DORA mede o impacto da engenharia no negócio através de indicadores de estabilidade e velocidade. Seus quatro indicadores principais são:

- **Frequência de Implantação**: com que frequência o código vai para produção (ex: diário, semanal).
- **Tempo de Lead para Mudança**: o tempo que leva desde o commit inicial até a entrega em produção.
- **Taxa de Falhas de Alteração**: a porcentagem de implantações que resultam em problemas na produção.
- **Tempo Médio de Recuperação (MTTR)**: tempo necessário para restaurar o serviço após uma falha.

**Pontos positivos**: são métricas objetivas, baseadas em dados do sistema. Permitem comparar times e identificar gargalos. Muito útil para equipes de DevOps.

**Pontos negativos**: foca apenas em entrega técnica, ignorando satisfação do time, colaboração e inovação. Pode incentivar deploys rápidos mas frágeis, se a taxa de falhas não for balanceada. Também não considera a qualidade do código ou o valor de negócio.

### Framework SPACE (Satisfaction, Performance, Activity, Communication, Efficiency)

O SPACE mede a eficácia e o fluxo do time de forma mais ampla, incluindo fatores comportamentais e qualitativos. Seus cinco componentes:

- **Satisfação e Bem-Estar**: pesquisas de satisfação, burnout e motivação com as ferramentas.
- **Performance**: resultados mensuráveis gerados pelo sistema, como qualidade, impacto e adoção de novas features.
- **Atividade**: quantidade de construções (builds), volume de revisões de código (pull requests) e andamento de sprints.
- **Comunicação e Colaboração**: qualidade da troca de informações, integração entre times e facilidade de documentação.
- **Eficiência e Fluxo**: capacidade de focar sem interrupções e velocidade para concluir tarefas do início ao fim.

**Pontos positivos**: aborda dimensões humanas e técnicas, equilibrando dados quantitativos e qualitativos. Ajuda a detectar problemas de burnout e colaboração.

**Pontos negativos**: métricas subjetivas (satisfação) podem ser difíceis de comparar. Exige disciplina para coletar dados qualitativos regularmente. Pode ser visto como "muita coisa para medir".

### Framework DevEx (Developer Experience)

O DevEx mede como a fricção técnica afeta o dia a dia, correlacionando o ambiente de trabalho com a capacidade de entrega. Indicadores comuns:

- **Qualidade do Código e Testes**: cobertura de testes automatizados e densidade de defeitos.
- **Fricção com Ferramentas**: tempo ocioso em revisões de código ou por lentidão de esteiras de CI/CD.
- **Taxa de Retrabalho**: porcentagem de tarefas ou funcionalidades que precisam ser refeitas.

**Pontos positivos**: foco na experiência do desenvolvedor, que é um dos maiores preditores de produtividade. Ajuda a identificar melhorias no ambiente.

**Pontos negativos**: métricas como "fricção" podem ser difíceis de capturar automaticamente. Pode exigir instrumentação adicional.

### Combinando frameworks: o melhor dos mundos

Nenhum desses frameworks é suficiente sozinho. O DORA fornece dados objetivos de entrega, mas ignora o lado humano. O SPACE captura o bem-estar e a colaboração, mas depende de pesquisas. O DevEx foca na experiência, mas pode perder o impacto de negócio.

A recomendação seria usar **DORA para dados objetivos** e **SPACE para entender o lado humano por trás dos números**. O DevEx serve como lente para identificar gargalos de ferramentas.

**Boas práticas**: foque em tendências, não em metas absolutas. Avalie a evolução histórica das métricas em vez de estabelecer notas individuais. Evite a Lei de Goodhart: nunca use métricas para punição individual. Uma métrica que vira alvo deixa de ser boa.

---

## Conclusão

Voltando ao litoral: medir é necessário, mas a régua importa. Usar o consumo de tokens como métrica de produtividade é como medir a costa com uma régua de 1 cm – você obtém um número gigantesco, mas irrelevante. As notícias sobre cobrança por token, restrições de planos e a cultura do Token Maxxing mostram que estamos no meio de uma transição onde as empresas tentam transformar IA em centro de custo controlável. Mas cabe a nós, profissionais, não cair na armadilha de medir o que é fácil em vez do que é importante.

Os frameworks DORA, SPACE e DevEx oferecem caminhos mais maduros, apesar de serem miopes ao usá-las isoladamente. Combiná-los permite uma visão sistêmica, que equilibra entrega, satisfação e eficiência. Mas exige cuidado: métricas são ferramentas, não fins. Como diz o ditado: "o que é medido é gerenciado", mas também "o que é mal medido é mal gerenciado".

> Confesso que aqui mora um desafio belo de engenharia: escolher réguas que capturem a complexidade do trabalho, sem se perder na ilusão de números bonitos que não refletem a realidade. Afinal, medir o litoral com precisão é **impossível**. A arte está em escolher a escala certa para cada pergunta.

---

## Referências

<ul>
  <li><a href="https://www.uol.com.br/tilt/colunas/diogo-cortiz/2026/05/10/token-maxxing-ranquear-funcionarios-pelo-uso-de-ia-virou-febre-corporativa.htm" target="_blank">"Token Maxxing: ranquear funcionários pelo uso de IA virou febre corporativa"</a>, UOL Tilt, 10/05/2026.</li>
  <li><a href="https://www.androidauthority.com/google-ai-pro-usage-limits-3669063/" target="_blank">"Google reduz preço do AI Ultra, mas impõe limites mais rígidos ao AI Pro"</a>, Android Authority.</li>
  <li><a href="https://manualdousuario.net/github-copilot-cobranca-tokens-ia/" target="_blank">"Microsoft migrará GitHub Copilot para cobrança por tokens a partir de 1º/6/2026"</a>, Manual do Usuário.</li>
  <li><a href="https://manualdousuario.net/claude-code-limites-uso/" target="_blank">"Anthropic gasta mais do que ganha e tenta cortar custos com Claude Code"</a>, Manual do Usuário.</li>
</ul>