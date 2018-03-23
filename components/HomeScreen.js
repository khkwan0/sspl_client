import React, {Component} from 'react'
import {View, Button, Text, AsyncStorage, TouchableHighlight} from 'react-native'
import Team from './Team'
import Teams from './Teams'
import Player from './Player'
import Players from './Players'
import Config from './Config'

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
  };

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
      serverAlive: true
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

  componentDidMount() {
    rv = false
    console.log(Config.server)
    console.log('ping')
    fetch(Config.server + '/ping')
    .then((response) => response.json())
    .then((responseJson) => {
      //console.log(responseJson)
      if (responseJson.response == 'pong') {        
        console.log(responseJson.response)
        rv = true
      }
      this.setState({
        serverAlive: rv
      })
    })
    .catch((err) => {
      console.log(err)
      this.setState({
        serverAlive: rv
      })
    })
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
      <View style={{flex: 1, justifyContent:'flex-start', flexDirection:'column', backgroundColor:'green'}}>
        {!this.state.serverAlive &&
          <View style={{flex: 1, flexDirection: 'row', justifyContent:'center'}}>
            <View>
              <Text style={{backgroundColor:'red', color: 'white'}}>Server is currently down.  Data will be saved on your device</Text>
            </View>
          </View>
        }

        <View style={{flex: 1, justifyContent:'flex-start', alignItems:'center',marginTop:100}}>
          <Text style={{fontSize: 24}}>Team: {team}</Text>      
        </View>

        <View style={{flex: 1, justifyContent:'flex-start', alignItems:'center'}}>
          <TouchableHighlight onPress={this.scoreSheetsBtnHandler} style={{paddingTop:10}}>
            <View style={{borderRadius:10, borderWidth: 1}}>
              <Text style={{fontSize:26, paddingLeft:10, paddingRight:10}}>
                Score Sheets
              </Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.archivesBtnHandler} style={{paddingTop:10}}>
            <View style={{borderRadius:10, borderWidth: 1}}>
              <Text style={{fontSize:26, paddingLeft:10, paddingRight:10}}>
                Archives
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
}

export default HomeScreen