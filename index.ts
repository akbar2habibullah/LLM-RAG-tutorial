import Similarity from 'compute-cosine-similarity'

import { getEmbedding } from './embedding'
import { insertVector, queryVector } from './vector'
import { chat } from './LLM'

const textExample = [
  "Feeling joyful and at peace.",
  "Content and deeply satisfied.",
  "Experiencing a sense of blissful serenity.",
  "Overflowing with happiness and tranquility.",
  "In a state of peaceful contentment and joy.",
  "Pain"
]

const query = "happiness and contentment"

const embeddingQuery = await getEmbedding(query)

console.log(`Embedding length from query: ${embeddingQuery.length} length\n`)

// Embedding calculation

const embeddings = []

for (let i = 0; i < textExample.length; i++) {
  const embedding = await getEmbedding(textExample[i])

  embeddings.push(embedding)
}

for (let i = 0; i < embeddings.length; i++) {
  const similarity = Similarity(embeddingQuery, embeddings[i])

  console.log(`Similarity between '${query}' and '${textExample[i]}': ${similarity}`)
}

console.log()

// Vector DB insertion (Uncomment for first run)

// for (let i = 0; i < embeddings.length; i++) {
//   insertVector(embeddings[i], { text: textExample[i] })
// }

// Vector DB query

const results = await queryVector(embeddingQuery)

for (let i = 0; i < results.length; i++) {
  console.log(`Query '${query}' similar with '${results[i].metadata?.text}'. Similarity score: ${results[i].score}`)
}

console.log()

// LLM usage without RAG

const responseChat = await chat('Hi')

console.log(`LLM response without RAG: '${responseChat}'\n`)

// LLM usage with RAG

let context = ''

for (let i = 0; i < results.length; i++) {
  context += `Context ${i + 1}: ${results[i].metadata?.text}\n`
}

console.log(context)

const responseChatRAG = await chat('Hi', context)

console.log(`LLM response with RAG: '${responseChatRAG}'\n`)