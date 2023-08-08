const express = require('express');
const gptRouter = express.Router();
require('dotenv').config();
const bodyParser = require('body-parser');
const axios = require('axios');

const chatGptApiUrl = 'https://api.openai.com/v1/chat/completions';
const apiKey = process.env.GPT_API_TOKEN;

gptRouter.use(bodyParser.json());

gptRouter.post('/sendMessege', async (req, res) => {
  const { messages } = req.body;

  const options = {
    method: 'POST',
    url: chatGptApiUrl,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    data: {
      model: "gpt-3.5-turbo",
      messages: messages,
    }
  };

  try {
    const response = await axios(options);
    const data = response.data;
    const answerResponse = data.choices[0].message.content;
    res.json(answerResponse);

  } catch (error) {
    console.error("Error communicating with GPT API:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});

module.exports = gptRouter;
