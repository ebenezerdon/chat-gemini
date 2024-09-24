// @ts-nocheck
import fetch from 'node-fetch'
import { getStaticFile } from './utils/staticFile.js'

export default async ({ req, res, log, error }) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY

  /* Handle GET request */
  if (req.method === 'GET') {
    return res.send(getStaticFile('index.html'), 200, {
      'Content-Type': 'text/html; charset=utf-8',
    })
  }

  /* Handle POST request */
  if (req.method === 'POST') {
    const body = req.body
    const prompt =
      body.prompt +
      `. Your output should be HTML. Do not include any heading or body tags. Just the content.
      Respond to greetings with a polite greeting.`

    const url =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' +
      GEMINI_API_KEY

    try {
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
      })

      const data = await response.json()

      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response received'

      const result = {
        ok: true,
        output: generatedText,
        finishReason: data.candidates?.[0]?.finishReason || 'Unknown',
        index: data.candidates?.[0]?.index || 0,
        safetyRatings: data.candidates?.[0]?.safetyRatings || [],
        usageMetadata: data.usageMetadata || {},
      }

      /* Return the result as JSON */
      return res.json(result, 200, {
        'Access-Control-Allow-Origin': '*',
      })
    } catch (err) {
      error('Error fetching response from Gemini API:', err)
      return res.json({ ok: false, error: err.message }, 500, {
        'Access-Control-Allow-Origin': '*',
      })
    }
  }

  /* Handle unsupported HTTP methods */
  return res.json({ ok: false, error: 'Method Not Allowed' }, 405, {
    'Access-Control-Allow-Origin': '*',
  })
}
