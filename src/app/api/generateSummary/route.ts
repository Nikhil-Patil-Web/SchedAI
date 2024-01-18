import { NextResponse } from 'next/server'
import openai from '../../../../openai'

export async function POST(request: Request) {
  const { todos } = await request.json()
  console.log(todos)
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    n: 1,
    stream: false,
    messages: [
      {
        role: 'system',
        content:
          'When responding welcome the user always as Nikhil Patil and say Welcome to SchedAI. Limit the response to 200 words',
      },
      {
        role: 'user',
        content: `Hi there provide a summary of the following todos. Count how many todos are in each category such as To do, In Progress and Done. Then tell the user to have a productive day. Here the data ${JSON.stringify(
          todos
        )}`,
      },
    ],
  })

  return NextResponse.json(response.choices[0].message.content)
}
