import { analyzeArticle } from './src/lib/bias-engine';

const testData = {
  headline: 'The radical left and their mainstream media allies are pushing a dangerous socialist agenda.',
  source: 'Fox News',
  url: 'https://foxnews.com/politics/radical-left-agenda',
  content: `
This shocking bombshell report reveals how the deep state is attacking traditional values.
We must fight back against this unprecedented assault on our democracy and economic freedom.
The fake news media continues to spread lies about election integrity and voter fraud.
Critics say the new healthcare mandate is a government takeover of medicine that will destroy jobs.
Meanwhile, the climate alarmists want to kill energy jobs with their radical green new deal.
  `
};

const ITERATIONS = 1000;

const start = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
  analyzeArticle(testData);
}
const end = performance.now();

console.log(`Original duration: ${(end - start).toFixed(2)}ms`);
