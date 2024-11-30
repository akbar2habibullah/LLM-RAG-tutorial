import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chat = async (message: string, context: string = 'No prior context') => {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        role: "system",
        content: `You are a helpful assistant. This is your context:
${context}.`,
      },
      {
        role: "user",
        content: message
      }
    ],
    "model": "gemma2-9b-it",
    "temperature": 1,
    "max_tokens": 1024,
    "top_p": 1,
    "stream": false,
    "stop": null
  });

  return chatCompletion.choices[0].message.content
}