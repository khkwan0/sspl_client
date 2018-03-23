import React, {Component} from 'react'
import {View, Button, Text, AsyncStorage} from 'react-native'
import Team from './Team'
import Teams from './Teams'
import Player from './Player'
import Players from './Players'

class HomeScreen extends React.Component {
  constructor(props) {
    super(props)

    this.scoreSheetsBtnHandler = this.scoreSheetsBtnHandler.bind(this)
    this.archivesBtnHandler = this.archivesBtnHandler.bind(this)
    this.setTeam = this.setTeam.bind(this)    
    this.savePlayer = this.savePlayer.bind(this)
    this.addMemberToTeam = this.addMemberToTeam.bind(this)

    this.players = new Players(null)
    this.players.addPrePlayer(new Player(0,'ken'))
    this.players.addPlayer(1, 'su')
    this.players.addPlayer(2, 'jo')
    this.players.addPlayer(3, 'blo')
    this.players.addPlayer(4, 'apple')
    this.players.addPlayer(5, 'orange')
    this.players.addPlayer(6, 'jack')
    this.players.addPlayer(7, 'oh')
    this.players.addPlayer(8, 'ton')

    this.teams = new Teams()
    this.teams.add(new Team(0, 'Crazy Breakers', [0, 1]))
    this.teams.add(new Team(1, 'Breakers Fun', [2, 3]))
    this.teams.add(new Team(2, 'Ice Breakers', [4, 5]))
    this.teams.add(new Team(3, 'Hideaway', [6, 7, 8]))
    /*
    this.teams = []
    this.teams.push({teamId: 0, teamName: 'Crazy Breakers',teamMembers: [{playerId: 0}, {playerId: 1}]})
    this.teams.push({teamId: 1, teamName: 'Breakers Fun', teamMembers: [{playerId: 2}, {playerId: 3}]})
    this.teams.push({teamId: 2, teamName: 'Ice Breakers', teamMembers: [{playerId: 4}, {playerId: 5}]})
    this.teams.push({teamId: 3, teamName: 'Hideaway', teamMembers: [{playerId: 6}, {playerId: 7}, {playerId: 8}]})
    */

    this.state = {
      teamID: -1,
      teamName: '',
      teams: this.teams,
      players: this.players,
    }
  }

  componentWillMount() {
    AsyncStorage.getItem('myTeam')
    .then((teamInfoStr) => {
      teamInfo = JSON.parse(teamInfoStr)
      if (!teamInfo || teamInfo.teamId == null || typeof teamInfo.teamId == 'undefined' || teamInfo.teamId < 0) {
        this.props.navigation.navigate('ChooseTeam', {setTeam: this.setTeam, teams: this.teams.getTeams()})        
      } else {
        this.setState({
          teamName: teamInfo.teamName,
          teamId: teamInfo.teamId
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })  

    this.utilities = {
      addMemberToTeam: this.addMemberToTeam,
      savePlayer: this.savePlayer,
    }

  }

  savePlayer(playerName) {
    playerId = 9
    newPlayer = {
      playerId: playerId,
      playerName: playerName
    }
    this.players.push({playerId: playerId, playerName: playerName})
    this.setState({
      players: this.players
    })
    this.addMemberToTeam
    return playerId
  }

  addMemberToTeam() {

  }

  scoreSheetsBtnHandler() {
    this.props.navigation.navigate('ScoreSheets', {teams: this.state.teams, players: this.players, utilities: this.utilities})
  }

  archivesBtnHandler() {
    this.props.navigation.navigate('Archives')
  }

  setTeam(teamId) {
    AsyncStorage.setItem('myTeam', JSON.stringify({teamName: this.teams.getTeam(teamId).teamName, teamId: teamId})).
    then(() => {
      this.setState({
        teamName: this.teams.getTeam(teamId).teamName,
        teamId: teamId
      })
    })
  }

  render() {
    const team = this.state.teamName
    return (
      <View>
        <Text>Team: {team}</Text>
        <Button onPress={this.scoreSheetsBtnHandler} title="Score Sheets" />
        <Button onPress={this.archivesBtnHandler} title="Archives" />
      </View>
    )
  }
}

export default HomeScreen