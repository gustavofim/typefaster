class Player {
  constructor(name) {
    this.name = name
    this.numTests = 0
    this.wpmHistory = []
    this.accHistory = []
    this.savedTexts = {}
  }
  
  save() {
    const playerData = {
      wpmHistory: this.wpmHistory,
      accHistory: this.accHistory,
      numTests: this.numTests
    };
  
    // Salvar as pontuações do jogador no localStorage
    localStorage.setItem('playerData', JSON.stringify(playerData));
  }
  
  load() {
    const playerData = localStorage.getItem('playerData');
    if (playerData) {
      const data = JSON.parse(playerData);
      this.wpmHistory = data.wpmHistory;
      this.accHistory = data.accHistory;
      this.numTests = data.numTests;
    }
  }

}