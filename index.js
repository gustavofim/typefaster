const express = require('express')
const { readFile } = require('fs').promises

const app = express()
const port = 3000
app.use(express.static('public'))

app.get('/', async (req, res) => {
  res.send(await readFile('./index.html', 'utf8'))
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})