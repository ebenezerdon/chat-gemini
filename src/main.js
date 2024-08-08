import fetch from 'node-fetch';
import constants from './constants.js';

export default async ({ req, res, log, error }) => {
  const GEMINI_API_KEY = constants.GEMINI_API_KEY;

  const body = req.body;
  const prompt = body.prompt || 'Say something nice';

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' +
    GEMINI_API_KEY;

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
              text: prompt,
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json();

  return res.json(data);
};
