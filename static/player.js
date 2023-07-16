class Player {
  constructor(name, password) {
    this.name = name
    this.password = password
    this.numTests = 0
    this.wpmHistory = []
    this.accHistory = []
    this.savedTexts = {}
  
    this.loadData()
  }

  save() {
    const playersData = JSON.parse(localStorage.getItem('playersData')) || {}
    const playerKey = `${this.name}_${this.password}`
    playersData[playerKey] = {
      name: this.name,
      savedTexts: this.savedTexts,
      wpmHistory: this.wpmHistory,
      accHistory: this.accHistory,
      numTests: this.numTests
    };
    localStorage.setItem('playersData', JSON.stringify(playersData))
  }

  loadData() {
    const playersData = JSON.parse(localStorage.getItem('playersData'))
    const playerKey = `${this.name}_${this.password}`
    if (playersData && playersData[playerKey]) {
      const data = playersData[playerKey]
      this.name = data.name || this.name;
      this.savedTexts = data.savedTexts || {}
      this.wpmHistory = data.wpmHistory || []
      this.accHistory = data.accHistory || []
      this.numTests = data.numTests || 0
    }
  }
}
