import fetch from 'node-fetch';
import constants from './constants.js';

// This is your Appwrite function
// It's executed each time we get a request
export default async ({ req, res, log, error }) => {
  // You can log messages to the console
  log('Hello, Logs!');

  error('Hello, Errors!');

  const GEMINI_API_KEY = constants.GEMINI_API_KEY;
  log('GEMINI_API_KEY ==>', GEMINI_API_KEY);

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' +
    GEMINI_API_KEY;

  /*   curl \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Explain how AI works"}]}]}' \
  -X POST 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY' */

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: 'Say something nice',
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  return res.json(data);
};
