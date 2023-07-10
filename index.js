const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const { readFile } = require('fs').promises

const { Configuration, OpenAIApi } = require("openai")
require("dotenv").config()

const port = process.env.PORT

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


app.use(express.static('static'))

app.get('/', async (req, res) => {
  res.send(await readFile('./index.html', 'utf8'))
})

async function getText(lang) {
}

io.on('connection', (socket) => {
  console.log('user connected'); 

    socket.on('req-lang', async (lang) => {
      console.log('requested: ' + lang)
      try {
        let completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [{
            "role": "user",
            "content": "a short (maximum 15 lines of code) " + lang + " code, inside a code block"
          }],
        });
        let completion_text = completion.data.choices[0].message.content;
        console.log(completion_text)
        // let msg = completion_text.split(/```[^\s]*/)[1].split('```')[0].trim()
        let msg = completion_text.split(/```[^\s]*/)[1].trim()
        // let msg = completion_text.split(/```[^\s]*/)
        // console.log(msg)
        // console.log("hoooo")
        socket.emit('get-code', msg)
      } catch (error) {
        if (error.response) {
          console.log(error.response.status);
          console.log(error.response.data);
        } else {
          console.log(error.message);
        }
      }
    })

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})

server.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
