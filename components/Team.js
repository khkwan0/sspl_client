class Team {
  constructor(teamId, teamName, teamPlayers) {
    this.teamId = teamId,
    this.teamName = teamName
    this.teamPlayers = teamPlayers
  }  

  addPlayer(playerId) {
    this.teamPlayers.push(playerId)
  }

  getPlayers() {
    return this.teamPlayers
  }  
}

export default Team