class Game {
  constructor() {
    this.lang = null
    this.socket = io()
    this.socket.on('get-code', msg => this.newText(msg))
    document.getElementById('game').addEventListener('keydown', ev => this.keyPress(ev))
    document.getElementById('restart-btn').addEventListener('click', ev => this.newGame(ev))
    document.getElementById('save-btn').addEventListener('click', ev => this.teste(ev))
    document.getElementById('lang-btn').addEventListener('click', ev => this.setLang(ev))
    this.dateTime = new Date()
    this.defaultText = `A<>line-and\nanother\nand. {]another\nDone`
    this.newGame()
  }

  newText(msg) {
    console.log(msg)
    this.defaultText = msg
    this.newGame()
  }

  setLang() {
    this.lang = document.getElementById('input-lang').value
    this.socket.emit('req-lang', this.lang)
  }

  newGame() {
    let text = this.getText()
    console.log(text)
    document.getElementById('game').innerHTML = this.format(text)
    this.all = document.querySelectorAll('.letter')
    this.currentLetter = 0;
    this.numLetters = text.length
    this.all[this.currentLetter].className += ' current'
    this.correct = 0
    this.error = 0
    this.state = 'running'
    this.startTime = 0
    this.time = 0
  }

  async gameOver() {
    document.getElementById('game').innerHTML = this.correct + '\n' + this.error + '<br>' + this.time
  }

  getText() {
    return this.defaultText
  }

  format(word) {
    word = word.replaceAll("\t", "→")
    word = word.replaceAll("    ", "→")
    let ret = '<span class="letter">'
    word.split('').forEach(function (item) {
      if (item != '\n' && item != '→') {
        ret += item
      } else if (item == '\n'){
        ret += '↲<br>'
      } else {
        ret += '→\xa0\xa0\xa0'
      }
      ret += '</span><span class="letter">'
    })
    ret += '</span>'
    return ret
  }

  keyPress(ev) {
    if (this.state === 'over') {
      if (ev.key === 'Enter') {
        this.newGame()
      }
      return;
    }

    if (this.startTime === 0) {
      this.startTime = this.dateTime.getTime()
      console.log(this.startTime)
    }

    const cur = this.all[this.currentLetter]

    if (!cur) return

    let key = ev.key
    const isLetter = /^[a-zA-Z \.\-\{\}\[\]\,<>]$/i.test(key)
    if (key === '<') {
      key = '&lt;'
    } else if (key === '>') {
      key = '&gt;'
    }

    console.log(key, isLetter, cur.innerHTML)

    if (!isLetter && key != 'Backspace' && key != 'Enter') return

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

      if (this.currentLetter === this.numLetters) {
        let now = new Date().getTime()
        this.time = (now - this.startTime) / 60000
        this.gameOver()
        this.state = 'over'
      }
      this.all[this.currentLetter].className += ' current'
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

console.log('Game start')
new Game()
