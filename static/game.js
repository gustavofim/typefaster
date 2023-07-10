class Game {
  constructor(player) {
    this.player = player
    this.lang = null
    this.socket = io()
    this.socket.on('get-code', msg => this.newText(msg))
    this.socket.on('get-error', msg => this.newError(msg))
    document.getElementById('game').addEventListener('keydown', ev => this.keyPress(ev))
    document.getElementById('restart-btn').addEventListener('click', ev => this.newGame(ev))
    document.getElementById('save-btn').addEventListener('click', ev => this.saveText(ev))
    document.getElementById('load-btn').addEventListener('click', ev => this.loadText(ev))
    document.getElementById('lang-btn').addEventListener('click', ev => this.setLang(ev))
    this.dateTime = new Date()
    this.defaultText = `A<>line-and\n\tanother\nand.    {]another\nDone`
    this.newGame()
  }

  loadText() {
    let loadName = document.getElementById('input-load').value
    this.defaultText = this.player.savedTexts[loadName]
    if (!this.defaultText) {
      this.defaultText = 'Saved text not found :('
    }
    newGame()
  }

  saveText() {
    let saveName = document.getElementById('input-save').value
    if (!saveName) {
      saveName = 'noName'
    }
    this.player.savedTexts[saveName] = this.defaultText
  }

  newText(msg) {
    console.log(msg)
    this.defaultText = msg
    this.newGame()
  }

  newError(msg) {
    console.log(msg)
    this.defaultText = 'Something went wrong :('
    this.newGame()
  }

  setLang() {
    this.lang = document.getElementById('input-lang').value
    this.socket.emit('req-lang', this.lang)
    document.getElementById('game').innerHTML = `<div class="spinner-border" role="status">
  <span class="visually-hidden">Loading...</span>
</div>`
  }

  newGame() {
    let text = this.getText()
    this.currentLetter = 0
    this.numLetters = 0
    document.getElementById('game').innerHTML = this.format(text)
    this.all = document.querySelectorAll('.letter')
    this.all[this.currentLetter].className += ' current'
    this.total = 0
    this.correct = 0
    this.uncorrected = 0
    this.error = 0
    this.state = 'running'
    this.startTime = 0
    this.time = 0
  }

  async gameOver() {
    let netWpm = (this.correct + this.error) / 5 / this.time
    netWpm = Math.floor(netWpm)
    let acc = this.correct / (this.correct + this.error) * 100
    document.getElementById('game').innerHTML = `<div class="card-group">
    <div class="card">
      <div class="card-body">
        <div class="card-header">Results</div>
        <div class="card-body">Correct: <span id="myGreen">${this.correct}</span>
            Errors: <span id="myRed">${this.error}</span><br>WPM: <span id="myYellow"">${netWpm}</span>
            Acuracy: <span id="myBlue">${acc.toFixed(2)}%</span></div>
      </div>
  </div>
    <div class="card">
      <div class="card-body">
        <div class="card-header">All Time Stats</div>
        <div class="card-body">
            Avg WPM: <span id="myYellow"">${netWpm}</span><br>
            Avg Acuracy: <span id="myBlue">${acc.toFixed(2)}%</span></div>
      </div>
      </div>
  </div>
</div>`
  }

  getText() {
    return this.defaultText
  }

  format(word) {
    word = word.replaceAll("\t", "→")
    word = word.replaceAll("    ", "→")
    let ret = '<span class="letter">'
    let numLetters = 0
    word.split('').forEach(function (item) {
      if (item != '\n' && item != '→') {
        ret += item
      } else if (item == '\n'){
        ret += '↲<br>'
      } else {
        ret += '→\xa0\xa0\xa0'
      }
      ret += '</span><span class="letter">'
      numLetters += 1
    })
    this.numLetters = numLetters
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
      this.startTime = new Date().getTime()
      console.log(this.startTime)
    }

    const cur = this.all[this.currentLetter]

    if (!cur) return

    let key = ev.key
    const isLetter = /^[0-9a-zA-Z \.\-\{\}\[\]\,<>\=\+\/\\\;\:\(\)\#]$/i.test(key)
    if (key === '<') {
      key = '&lt;'
    } else if (key === '>') {
      key = '&gt;'
    }

    console.log(key, isLetter, cur.innerHTML)

    if (!isLetter && key != 'Backspace' && key != 'Enter' && key != 'Tab') return

    ev.preventDefault()

    this.total += 1

    if (isLetter || key === 'Enter' || key === 'Tab') {
      this.currentLetter += 1

      if (key === cur.innerHTML || (key === 'Enter' && cur.innerHTML === '↲<br>') || (key === 'Tab' && cur.innerHTML === '→&nbsp;&nbsp;&nbsp;')) {
        cur.className = 'letter correct'
        this.correct += 1
      } else {
        cur.className = 'letter error'
        if (cur.innerHTML === ' ')
        cur.className += ' space'
        this.error += 1
        this.uncorrected += 1
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

      if (newCur.classList.contains('correct')) {
        this.correct -= 1
      } else if (newCur.classList.contains('error')) {
        this.uncorrected -= 1
      }

      newCur.className = 'letter current'
      cur.className = 'letter'
    }
  }
}
