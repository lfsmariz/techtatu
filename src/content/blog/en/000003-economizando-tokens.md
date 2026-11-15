---
title: 'Saving Tokens and Getting Good Results'
description: 'A guide to understanding how RAG works'
pubDate: 'Nov 15 2025'
heroImage: '../../../assets/software-develop.webp'
draft: false
locale: en
translationKey: 000003-economizando-tokens
---

Talking, discussing, debating, and studying AI nowadays has often become an extremely dense alphabet soup, full of vocabulary but short on depth. Do not get me wrong: the ability to understand, channel, and apply knowledge amid this bombardment of technologies, libraries, and models is admirable. But let us take a breath.

I always recommend that my mentees take one step beyond what is bubbling on the surface. MCP, LLMs, tokens, embeddings, fine-tuning, prompt engineering, context windows, zero-shot learning, chain-of-thought, RAG... It seems infinite, and perhaps it is. Let us acknowledge our limits and focus on the next step.

In my studies, RAG always seemed to appear in many different contexts. But I kept finding tutorials that offered little more than a few attractive words, repeating them without explaining anything beyond the terms themselves.

- Retrieval process
- Data augmentation
- LLM generation

## Let us imagine the scenario
> Anacleto is a very organized person who records his days in a collection of ~~journaling~~ journals, and he would love to have his AI assistant summarize his health-related activities from the past year.

#### Naive solution:
Send all the journals along with the question.

#### Problems:
- Loading every journal from the past year would use a lot of tokens.
- It may bring in a lot of irrelevant information, increasing the chance of an AI hallucination.
- Context-size limits may result in important parts of the submitted content being cut off.

**P.S.: infinite context does not exist; it will always be a combination of windowing and sliding-window strategies (two more terms for your vocabulary).**

#### Coherent solution:
We will use RAG — _Retrieval-Augmented Generation_ — and the problem is solved: choose whichever tutorial you like best and ___DONE___. But what comes next?

### Step 1 - Embedding

We often represent data with other data. This lets us do remarkable things in computing, from hashes for integrity checks to indexes that optimize searches.

> An embedding is a numerical representation of text, in the form of a vector of floating-point numbers.

But how do we generate an embedding? That question has several nuances and would require another step, but to stay focused we will simply use ___embeddinggemma___, a pretrained model with 300M parameters.

```javascript
async function generateEmbeddings(text) {
    const resp = await ollama.embed({
        model: 'embeddinggemma',
        input: text,
    });
    return new Float32Array(resp.embeddings.flat());
}
```

Where do we generate and save it? We could use Elasticsearch, but since I am explaining the basics here, we will use SQLite with SQLiteVec. **Seriously, I am still surprised by how versatile SQLite is.**

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

In my example, I used 10 sample journals covering different subjects in the ___journal${index}.md___ format; this gives my __llama3.2__ model a reasonable sample of context.

### Step 2 - Retrieving with embeddings

Retrieval with embeddings consists of turning both stored texts and the user query into vectors of numbers (embeddings). These vectors let us measure how much they resemble one another through a mathematical comparison. The main method used to measure this similarity is **cosine similarity**.

Cosine similarity calculates the angle between two vectors in multidimensional space: the closer to 1, the more similar they are; the closer to 0, the less similar. So, when we want to find similar texts, we calculate the query embedding and compare it with the saved embeddings, returning those with the greatest similarity.

#### Why use this similarity?
The main benefit of cosine similarity is that it ignores the vector magnitude (length) and focuses only on direction. In text contexts, an embedding vector’s magnitude may be related to text length or word frequency, not necessarily meaning.

By focusing on direction, the metric ensures that a short, well-written paragraph about topic X is considered more similar to a question about X than a long, irrelevant article, even if the long article has a vector with greater magnitude.

#### In SQLiteVec, it looks roughly like this:

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

Once we perform the semantic search for the question:

> What were the recent appointments and doctors?

#### We get the following top three matches:

```json
[
  {
    id: '0',
    content: '**Journaling Fake**\n' +
      '================\n' +
      '\n' +
      'Today I went to the dentist for a checkup and to take better care of my oral health. It was important for keeping my teeth healthy and preventing future problems.\n',
    distance: 0.9737769365310669
  },
  {
    id: '1',
    content: '**Reflection Journal**\n' +
      '=====================\n' +
      '\n' +
      'Today I went to the doctor to investigate discomfort in my throat that I had felt for several days. The doctor was very attentive and explained the possible causes and how to proceed with treatment in detail.\n' +
      '\n' +
      'I left the appointment relieved, feeling that looking after our health really is essential. I reflected on how I often set minor symptoms aside because of the rush of daily life. I intend to pay closer attention to my body and seek medical help whenever necessary.',
    distance: 1.0204509496688843
  },
  {
    id: '5',
    content: '**Journaling Fake**\n' +
      '=====================\n' +
      '\n' +
      'Today I decided to rethink my eating habits and focus on healthier choices in my daily life. I added more fruit and vegetables to my meals and tried to avoid ultra-processed foods. I feel that investing in a balanced diet benefits not only physical health but also my well-being and energy for facing the routine.\n',
    distance: 1.0411263704299927
  }
]
```

Notice how effective semantic proximity is at identifying the text about the dentist/oral health as relevant, even without the word **"appointment"** or **"doctor"**.

Also notice how **"healthy eating habits"** scores very well in our example.

### Passo 3 - Agora sim criamos o contexto.

Now let us pass only what was retrieved using a simple prompt like this:

```javascript
async function verifyJournal(similarJournals, search) {
    const journal = similarJournals.map(journal => journal.content).join('\n');

    const messages = [
        {
            role: 'system',
            content: `You are a tool that answers questions based on the information provided.`
        },
        {
            role: 'user',
            content: `Based on the information provided:
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

And __Voilà__! We have a coherent and efficient answer using, on average, less than 30% of the tokens we would use in an example loaded with every file.

```markdown
Com base nos textos fornecidos, posso identificar duas consultas recentes:

1. **Dentist**: The person went to the dentist for a checkup and to take better care of their oral health.
2. **Doctor**: The person also visited a doctor to investigate throat discomfort and receive guidance on how to proceed with treatment.
There is no specific information about other medical appointments or healthcare professionals in the supplied texts.
```

## Conclusion

In summary, by using semantic search to reduce the context sent to the model, we get precise and objective answers while optimizing token and computing-resource usage. This shows how intelligent retrieval techniques can be powerful allies when building more economical and efficient systems without sacrificing answer quality.

### Ou melhor...

Sending all the journals with the same question harmed my context window; imagine attention flow getting lost because of its randomized bias, giving the model a chance to lose performance and efficiency while answering. If you doubt it, look at this example I tested with a context window of only 10 files, and imagine the cost of running the query again because the answer was not good enough.

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
            content: `You are a tool that answers questions based on the information provided.`
        },
        {
            role: 'user',
            content: `Based on the information provided:
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
It was not possible to determine the recent appointments
and doctors for a person based on the supplied information.
Information about medical appointments is not present in the provided texts.
```

This text was only meant to clarify RAG’s embedding layer, one part of the magic we use. But remember that it is not a silver bullet and will not always suit your specific purpose.

> If low code is suspected, a developer must be consulted
>
> - Ministry of Development

<br/>

-----
<br/>
<br/>

##### Article base code: LINK
##### Want to learn more about the Mentorship? Contact me on <a href="https://www.linkedin.com/in/luizfilipesmariz/" target="_blank">Linkedin</a>
