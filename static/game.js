class Game {
  constructor() {
    document.getElementById('typing-test').addEventListener('keydown', ev => this.keyPress(ev))
    this.newGame()
  }

  newGame() {
      let text = this.getText()
      document.getElementById('game').innerHTML = this.format(text)
      this.all = document.querySelectorAll('.letter')
      this.currentLetter = 0;
      this.numLetters = text.length
      this.all[this.currentLetter].className += ' current'
      this.correct = 0
      this.error = 0
  }

  getText() {
    return `A line and\nanother\nand another\nDone`
  }

  format(word) {
      let ret = '<span class="letter">'
      word.split('').forEach(function (item) {
          if (item != '\n') {
              ret += item
          } else {
              ret += '↲<br>'
          }
          ret += '</span><span class="letter">'
      })
      ret += '</span>'
      return ret
  }

  keyPress(ev) {
    console.log("hoe")
    const cur = this.all[this.currentLetter]

    if (!cur) return

    const key = ev.key;
    const isLetter = /^[a-zA-Z ]$/i.test(key)

    if (!isLetter && key != 'Backspace' && key != 'Enter') return

    console.log(key)

    if (isLetter || key === 'Enter') {
        this.currentLetter += 1

        if (key === cur.innerHTML || (key === 'Enter' && cur.innerHTML === '↲<br>')) {
            cur.className = 'letter correct'
            this.correct += 1
        } else {
            cur.className = 'letter error'
            if (cur.innerHTML === ' ')
                cur.className += ' space'
            this.error += 1
        }

        if (this.currentLetter < this.numLetters) {
            this.all[this.currentLetter].className += ' current'
        }
    } else if (key === 'Backspace') {
        if (this.currentLetter === 0) return

        this.currentLetter -= 1
        const newCur = this.all[this.currentLetter]

        if (newCur.classList.contains('correct'))
            this.correct -= 1

        newCur.className = 'letter current'
        cur.className = 'letter'
    }
  }
}

console.log("hey baby")
new Game()
