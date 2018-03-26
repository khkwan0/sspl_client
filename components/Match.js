import React, {Component} from 'react'
import {ScrollView, View, StyleSheet, Text, AsyncStorage} from 'react-native'
import Set from './Set'
import io from 'socket.io-client'
import Players from './Players'
import Player from './Player'
import Config from './Config'

class Match extends Component {
  static navigationOptions = {
    title: 'Match',
  };
  constructor(props) {
    super(props)

    matchData = this.props.navigation.state.params.matchData
    gameDataStorageKey = 'match'+matchData.matchId
    this.myTeamId = this.props.navigation.state.params.myTeamId
    this.players = new Players()

    console.log(this.props.navigation.state.params.homeTeam)
    this.state = {
      matchId: matchData.matchId,
      matchDate: matchData.matchDate,
      homeTeam: this.props.navigation.state.params.homeTeam,
      awayTeam: this.props.navigation.state.params.awayTeam,
      matchType: matchData.matchType,
      season: matchData.season,
      round: matchData.round,
      gameData: new Array(36),
      homeCaptainSubmit: matchData.homeCaptainSubmit,
      awayCaptainSubmit: matchData.awayCaptainSubmit
    }
    this.setGameData = this.setGameData.bind(this)
    this.wsSetup = this.wsSetup.bind(this)
    this.getGameData = this.getGameData.bind(this)
    this.getGameDataLocal = this.getGameDataLocal.bind(this)
    this.getGameDataRemote = this.getGameDataRemote.bind(this)
    this.getPlayerData = this.getPlayerData.bind(this)
    this.getPlayerDataByTeam = this.getPlayerDataByTeam.bind(this)
    this.getPlayerDataRemote = this.getPlayerDataRemote.bind(this)
    this.getPlayerDataLocal = this.getPlayerDataLocal.bind(this)
  }

  wsSetup() {
    //this.socket = openSocket('http://192.168.1.106:9988')
    this.socket = io('http://192.168.1.106:9988')
    this.socket.on('connect', (err) => {
      if (err) {
        console(err)
      }
      this.socket.emit('message', {event: 'join', data: {room: 'match'+matchData.matchId}})
    })
    this.socket.on('rcvmsg', (msg) => {
      if (typeof msg.event != 'undefined' && msg.event == 'gamedata') {
        this.newArray = this.state.gameData
        this.newArray[msg.data.gameNo] = msg.data
        this.setState({
          gameData: this.newArray        
        })
        AsyncStorage.setItem(gameDataStorageKey, JSON.stringify(this.state))
      }
    })
  }

/*
  componentWillMount() {
    if (Config.disableLocalSave) {
      this.getMyTeamPlayers()
    } else {
      // get my team from local
      console.log('get players from local')
      AsyncStorage.getItem('myTeamPlayers')
      .then((myPlayersStr) => {
        try {
          myPlayers = JSON.parse(myPlayersStr)
          for (let i = 0; i < myPlayers.length; i++) {
            this.players.addPlayer(myPlayers.playerId, myPlayers.playerName)
          }
        } catch(err) {
          console.log(err)
          this.getMyTeamPlayers()
        }
      })
      .catch((err) => {      
        console.log(err)
        this.getMyTeamPlayers()
      })
    }
  }

  getMyTeamPlayers() {
    console.log('get players from reomte')
    fetch(Config.server + '/players/' + this.myTeamId)
    .then((results) => results.json())
    .then((resultJson) => {
      if (typeof resultJson.players != 'undefined' && resultJson.players) {
        resultJson.players.forEach((player, index) => {
          this.players.addPlayer(player[0]._id, player[0].playerName)
        })
        console.log(this.players)
      }
    })
    .catch((err) => {
      console.log(err)
    })    
  }
  */

  getGameDataLocal() {
    return new Promise((resolve, reject) => {
      if (!Config.disableLocalSave) {
        AsyncStorage.getItem(gameDataStorageKey)
        .then((gameDataStr) => {
          gameData = JSON.parse(gameDataStr)
          resolve(gamehData)
        })
        .catch((err) => {
          reject(err)
        })
      } else {
        reject('local storage disabled')
      }
    })
  }

  getGameDataRemote() {
    console.log('get game data remote')
    return new Promise((resolve, reject) => {
      fetch(Config.server + '/match/' + matchData.matchId)
      .then((result) => result.json())
      .then((_gameData) => {
        resolve(_gameData)
      })
      .catch((err) => {
        reject(err)
      })
    })
  }

  getGameData() {
    console.log('get game data')
    return new Promise((resolve, reject) => {
      this.getGameDataLocal()
      .then((_gameData) => {
        newArray = this.state.gameData
        _gameData.forEach((gameData) => {
          newArray[gameData.gameNo] = gameData
        })
        resolve(newArray)
      })
      .catch((err) => {
        console.log(err)
        this.getGameDataRemote()
        .then((_gameData) => {
          newArray = this.state.gameData
          _gameData.forEach((gameData) => {
            newArray[gameData.gameNo] = gameData
          })
          resolve(newArray)
        })
        .catch((err) => {
          reject(err)
        })
      })
    })
  }

  getPlayerDataLocal() {
    return new Promise((resolve, reject) => {
      if (!Config.disableLocalSave) {
        reject('not implemented')
      } else {
        reject('local storage disabled')
      }
    })
  }

  getPlayerDataByTeam(teamId) {  
    return new Promise((resolve, reject) => {
      fetch(Config.server + '/players/' + teamId)
      .then((results) => results.json())
      .then((resultJson) => {
        if (typeof resultJson.players != 'undefined' && resultJson.players) {
          resolve(resultJson.players)  
        }
      })
      .catch((err) => {        
        console.log(err)
        reject(err)
      })    
    })
  }

  getPlayerDataRemote() {
    return new Promise((resolve, reject) => {
      toPromise = []
      toPromise.push(this.getPlayerDataByTeam(this.state.homeTeam.teamId))
      toPromise.push(this.getPlayerDataByTeam(this.state.awayTeam.teamId))
      Promise.all(toPromise)
      .then((_players) => {
        _players[0].forEach((players) => {          
          //console.log(players)
          if (players.length) {
            players.forEach((player) => {
              this.players.addPlayer(player._id, player.playerName)
            })

          }          
        })        
        resolve(this.players)
      })
      .catch((err) => {
        reject(err)
      })
    })
  }

  getPlayerData() {
    return new Promise((resolve, reject) => {
      this.getPlayerDataLocal()
      .then((_playerData) => {
        resolve(_playerData)
      })
      .catch((err) => {
        this.getPlayerDataRemote()
        .then((_playerData) => {
          //console.log(_playerData)
          resolve(_playerData)
        })
        .catch((err) => {
          reject(err)
        })
      })
    })
  }

  componentDidMount() {
    this.wsSetup()
    this.getGameData()
    .then((_gameData) => {
      this.getPlayerData()
      .then((_players) => {
        this.setState({
          players: _players,
          gameData: _gameData
        })
      })
      .catch((err) => {        
        console.log(err)
        this.setState({
          gameData:_gameData
        })
      })
    })
    .catch((err) => {
      this.getPlayerData()
      .then((_players) => {
        this.setState({
          players:_players
        })
      })
      .catch((err) => {
        console.log(err)
      })
    })
  }

  setGameData(gameData) {
    gameDataMsg = gameData
    gameDataMsg.matchId = matchData.matchId
    this.socket.emit('message', {event: 'gamedata', data: {room: 'match'+matchData.matchId, gameData: gameDataMsg}})
    if (!this.socket.connected) {
      console.log('not connected')
      newArray = this.state.gameData
      newArray[gameData.gameNo] = gameData
      this.setState({
        gameData: newArray
      })
      AsyncStorage.setItem(gameDataStorageKey, JSON.stringify(this.state))
    }
  }

  render() {
    if (this.state.matchType == 'nine') {
      toRender = (
        <View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View>
              <Text style={{fontSize: 16}}>{this.state.matchDate.toDateString()}</Text>
            </View>
            <View>
              <Text style={{fontSize:20}}>Nine Ball</Text>
            </View>
            <View>
              <Text style={{fontSize:16}}>Round {this.state.round}</Text>
            </View>
          </View>
          <View style={styles.matchMetaData}>
            <View>
              <Text style={{fontSize: 18}}>Home: {this.state.homeTeam.teamName}</Text>
            </View>
            <View>
              <Text style={{fontSize: 18}}>Away: {this.state.awayTeam.teamName}</Text>
            </View>
          </View>
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={1} 
            type={2}
            numGames={4}
            startingGameNo={1} />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={2}
            type={1}
            numGames={8} 
            startingGameNo={5} />
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={3} 
            type={2}
            numGames={4}
            startingGameNo={13} />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={4}
            type={1}
            numGames={8} 
            startingGameNo={17} />
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={5} 
            type={2}
            numGames={4}
            startingGameNo={25} />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={6}
            type={1}
            numGames={8} 
            startingGameNo={33} />                        
        </View>
      )
    } else {
      toRender = (
        <View>
        </View>
      )
    }
    return(
      <ScrollView>
        {toRender}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  matchMetaData: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default Match