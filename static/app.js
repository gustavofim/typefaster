  document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen')
    const gameScreen = document.getElementById('game-screen')
    const startBtn = document.getElementById('start-btn')
  
    startBtn.addEventListener('click', () => {
      const playerName = document.getElementById('input-name').value
      const playerPassword = document.getElementById('input-password').value
      const player = new Player(playerName, playerPassword)
      startScreen.classList.add('d-none')
      gameScreen.classList.remove('d-none')
  
      // Inicializar o jogo aqui
      const game = new Game(player)
    })
  })