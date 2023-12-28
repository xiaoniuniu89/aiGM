import { openai } from './openai.js';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const newMessage = async (history, message) => {
    let full = '\nGM: ';
  const result = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [...history, message],
    temperature: 0.6,
    stream: true,
  });

  for await (const part of result) {
    let text = part.choices[0].delta.content ?? '';
    full += text;
    console.clear();
    console.log(full);
  }
  return formatMessage(full, 'system');
};

const formatMessage = (message, role) => {
  return ({role: role, content: message} )
}


const chat = () => {
    const history = [
        {
            role: 'system',
            content: 'You are an AI Dungeon master for a table top roleplaying game, interact with the user to create a story.',
        },
    ];

    const start = async () => {
        rl.question('You: ', async (message) => {
            if (message.toLowerCase() === 'exit') {
                rl.close();
                return;
            }
        const userMessage = formatMessage(message, 'user');
        const response = await newMessage(history, userMessage);

        history.push(userMessage, response);
        // console.log(`\nAI: ${response.content}`);

        start();
        });
    };

    start();
};

console.log('Chatbot initialised. Type "exit" to quit.')
chat();