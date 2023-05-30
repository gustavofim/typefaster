text = `A line and\nanother
and another`

function format(word) {
    //ret = `<span class="letter">${word.split('').join('</span><span class="letter">')}</span>`
    //ret.replace(/\n/g, '<br>')
    ret = '<span class="letter">'
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

document.getElementById('typing-test').addEventListener('keydown', ev => {

    const cur = all[currentLetter]

    if (!cur) return

    const key = ev.key;
    const isLetter = /^[a-zA-Z ]$/i.test(key)

    if (!isLetter && key != 'Backspace' && key != 'Enter') return

    console.log(key)

    if (isLetter || key === 'Enter') {
        currentLetter += 1

        if (key === cur.innerHTML || (key === 'Enter' && cur.innerHTML === '↲<br>')) {
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
    } else if (key === 'Backspace') {
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
