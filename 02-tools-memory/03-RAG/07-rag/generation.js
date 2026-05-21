import { PromptTemplate } from '@langchain/core/prompts';
import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { Ollama } from '@langchain/ollama';

const llm = 'llama3.2';

const model = new Ollama({
  model: llm,
});

const prompt =
  PromptTemplate.fromTemplate(`You are a helpful AI. You can answer every question.

Question: {question}`);

const chain = RunnableSequence.from([
  {
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

const result = await chain.invoke('What is the meaning of the color blue?');

console.log(result);
