const express = require('express');
const gptRouter = express.Router();
require('dotenv').config();
const bodyParser = require('body-parser');
const axios = require('axios');
const {Configuration, OpenAIApi } = require("openai");

const chatGptApiUrl = 'https://api.openai.com/v1/chat/completions';
const apiKey = process.env.GPT_API_TOKEN;
  // const config = new Configuration({
  //   apiKey: process.env.GPT_API_TOKEN
  // })

  // const openai = new OpenAIApi(config);
gptRouter.use(bodyParser.json());

gptRouter.post('/sendMessege', async (req, res) => {
  const { messages } = req.body;
  
  // const completion = await openai.createCompletion({
  //   model: "gpt-3.5-turbo",
  //   prompt: messages,

  //   stream: true

  // })

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
      stream: true
    },
    responseType: 'stream'
  };

  try {
    const response = await axios(options);
    let responseData = '';

    response.data.on('data', (chunk) => {
      //console.log(chunk);
      let StreamedChunk = chunk.toString().trim();
      //console.log("string: " + StreamedChunk);
      const startIndex = StreamedChunk.indexOf('{'); // Find the first '{'
      const endIndex = StreamedChunk.lastIndexOf('}'); // Find the last '}'  
      const extractedJson = StreamedChunk.substring(startIndex, endIndex + 1);

      const contentStart = '"content":"';
      const contentEnd = '"},"finish_reason"';

      const strtIndex = extractedJson.indexOf(contentStart) + contentStart.length;
      const endIndx = extractedJson.indexOf(contentEnd, strtIndex);

      if (strtIndex >= 0 && endIndx >= 0) {
        const content = extractedJson.substring(strtIndex, endIndx);
        responseData += content
        //console.log(responseData);
      } else {
        console.error('Content not found.');
      }

      //const object = JSON.parse(extractedJson);
      //console.log(object);

    });

    response.data.on('end', () => {
      let resultString = responseData.replace(/\\n/g, '');
      
      console.log("full responseData: " +resultString);
      
      resultString = resultString.trim();
      if(resultString.charAt(0) === `\\`){
        resultString = "{" +resultString;
      }
      
      console.log("full responseData: " +resultString);
      
      const startIndex = resultString.indexOf('{'); // Find the first '{'
      const endIndex = resultString.lastIndexOf('}'); // Find the last '}'  
      const extractedJson = resultString.substring(startIndex, endIndex + 1);
      let final = extractedJson.replace(/\\/g, '');
      final = final.replace(/\s+/g, ' ');
      console.log(final);
      try{
        JSON.parse(final);
        res.send(final);
      }
      catch{
        console.log("error while parsing");
        res.status(500).send("internal server error");
      }

    });

    response.data.on('error', (error) => {
      console.error('Error streaming data:', error);
      res.status(500).send('An error occurred while streaming data');
    });

  } catch (error) {
    console.error("Error communicating with GPT API:", error);
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
});

module.exports = gptRouter;
