#!/usr/bin/env node
// Service Analyzer Console App
// Usage: node service-analyzer.js
// Requires: Node.js v18+ (for fetch API)
// IMPORTANT: Set your OpenAI API key in the environment variable OPENAI_API_KEY

const readline = require('readline');
const fs = require('fs');

// Check for API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error('Error: Please set your OpenAI API key in the OPENAI_API_KEY environment variable.');
  process.exit(1);
}

// Few-shot examples for prompt
const FEW_SHOT_EXAMPLES = `
Input: Spotify
Output:
## Brief History
Founded in 2006 in Sweden, Spotify launched publicly in 2008. It quickly became a leader in music streaming, expanding globally and going public in 2018.

## Target Audience
Music listeners, artists, podcast creators, and advertisers worldwide.

## Core Features
- On-demand music streaming
- Personalized playlists and recommendations
- Podcast streaming
- Offline listening

## Unique Selling Points
- Extensive music catalog
- Advanced recommendation algorithms
- Free ad-supported tier

## Business Model
Freemium: free ad-supported access, paid premium subscriptions, and advertising revenue.

## Tech Stack Insights
Uses cloud infrastructure, machine learning for recommendations, and cross-platform apps (web, mobile, desktop).

## Perceived Strengths
- Large music library
- User-friendly interface
- Strong personalization

## Perceived Weaknesses
- Limited features on free tier
- Artist payout concerns

---
Input: Our platform helps creators monetize content by offering subscription tools, analytics, and community features.
Output:
## Brief History
Launched in the early 2020s to address the growing creator economy, the platform has evolved to support a wide range of digital creators.

## Target Audience
Independent creators, influencers, and small businesses seeking to monetize digital content.

## Core Features
- Subscription management
- Analytics dashboard
- Community engagement tools
- Payment processing

## Unique Selling Points
- Integrated analytics
- Flexible subscription options
- Community-building features

## Business Model
Takes a percentage of creator earnings and offers premium platform features for a monthly fee.

## Tech Stack Insights
Likely uses cloud hosting, payment APIs, and analytics frameworks.

## Perceived Strengths
- Empowers creators to earn directly
- All-in-one platform

## Perceived Weaknesses
- Platform fees may deter some users
- Competition from established platforms
`;

// Prompt template
function buildPrompt(userInput) {
  return `You are a service analyst AI. Given a service name or description, generate a markdown report with the following sections:\n\n- Brief History\n- Target Audience\n- Core Features\n- Unique Selling Points\n- Business Model\n- Tech Stack Insights\n- Perceived Strengths\n- Perceived Weaknesses\n\nUse clear markdown formatting.\n\n${FEW_SHOT_EXAMPLES}\n---\nInput: ${userInput}\nOutput:\n`;
}

// OpenAI API call
async function fetchOpenAIReport(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful service analyst.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1200,
      temperature: 0.7
    })
  });
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.choices[0].message.content.trim();
}

// Main CLI logic
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter a service name or description: ', async (userInput) => {
    rl.close();
    console.log('\nAnalyzing... Please wait.');
    try {
      const prompt = buildPrompt(userInput);
      const report = await fetchOpenAIReport(prompt);
      console.log('\n--- Service Analysis Report ---\n');
      console.log(report);
      // Offer to save to file
      const saveRl = readline.createInterface({ input: process.stdin, output: process.stdout });
      saveRl.question('\nSave report to file? (y/n): ', (answer) => {
        if (answer.trim().toLowerCase() === 'y') {
          const filename = 'service_report.md';
          fs.writeFileSync(filename, report, 'utf8');
          console.log(`Report saved to ${filename}`);
        }
        saveRl.close();
      });
    } catch (err) {
      console.error('Error:', err.message);
    }
  });
}

main(); 