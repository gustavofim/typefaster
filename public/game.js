text = 'A bunch of pips and pops'

function format(word) {
  return `<span class="letter">${word.split('').join('</span><span class="letter">')}</span>`;
}

function newGame() {
    document.getElementById('game').innerHTML = format(text);
    all = document.querySelectorAll('.letter')
    currentLetter = 0;
    numLetters = text.length
    all[currentLetter].className += ' current'
    console.log(numLetters)
    correct = 0
    error = 0
}

document.getElementById('overrides').addEventListener('keydown', ev => {

    const cur = all[currentLetter]

    if (!cur) return

    const key = ev.key;
    const isLetter = /^[a-zA-Z ]$/i.test(key)

    if (!isLetter && key != 'Backspace') return

    console.log(key)

    if (isLetter) {
        currentLetter += 1

        if (key === cur.innerHTML) {
            cur.className = 'letter correct'
            correct += 1
        } else {
            cur.className = 'letter error'
            if (cur.innerHTML === ' ')
                cur.className += ' space'
            error += 1
        }

        if (currentLetter < numLetters) {
            all[currentLetter].className += ' current'
        }
    } else {
        if (currentLetter === 0) return

        currentLetter -= 1
        const newCur = all[currentLetter]

        if (newCur.classList.contains('correct'))
            correct -= 1

        newCur.className = 'letter current'
        cur.className = 'letter'
    }
})

newGame()