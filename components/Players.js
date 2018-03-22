import Player from './Player'

class Players {
  constructor(players) {
    if (players) {
      this.players = players
    } else {
      this.players = []
    }
  }

  addNewPlayer(playerName) {
    newPlayerId = 9999
    player = new Player(newPlayerId, playerName)
    this.players.push(player)
    return player
  }

  addPlayer(playerId, playerName) {
    player = new Player(playerId, playerName)
    this.players.push(player)
  }

  addPrePlayer(player) {
    this.players.push(player)
  }

  getPlayer(playerId) {
    i = 0
    found = false
    rv = null
    while (i < this.players.length && !found) {
      if (this.players[i].playerId == playerId ) {
        rv = this.players[i]
        found = true
      }
      i++
    }
    return rv
  }
}

export default Players