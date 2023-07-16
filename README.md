# TypeFaster

Typing test/game for programmers. Made with Node.js, express.js, socket.io and OpenAI API.

## The game

Very simple implementation with `js` and `css`. 
Each letter is in a separated `span`, the game loop compares the input with the correct letter and sets the `span` classes for coloring with `css`.

Amount of correct and wrong player inputs is used to calculate the words per minute (the size of a word is usually considered to be 5) and accuracy of the player:

- `wpm = (correct + error) / 5 / time_taken`
- `acc = correct / (correct + wrong) * 100`

## Running the app
- Make sure node is installed;
- Create a `.env` file in the root directory of the project and define the `PORT` and the `OPENAI_API_KEY` variables;
- Run:

```bash
npm install
node .
```

## Todo

- Real authentication;
- Better handling of openai queries;
- Deployment?
