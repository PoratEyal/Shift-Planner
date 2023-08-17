const express = require('express');
const gptRouter = express.Router();
require('dotenv').config();
const bodyParser = require('body-parser');
const axios = require('axios');

const chatGptApiUrl = 'https://api.openai.com/v1/chat/completions';
const apiKey = process.env.GPT_API_TOKEN;

gptRouter.use(bodyParser.json());

const axiosInstance = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  },
});

gptRouter.post('/sendMessege', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await axiosInstance.post('/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const answerResponse = response.data.choices[0].message.content;
    res.json(answerResponse);
  } catch (error) {
    console.error("Error communicating with GPT API:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});



module.exports = gptRouter;
