import React, {Component} from 'react'
import {ScrollView, View, StyleSheet, Text, AsyncStorage} from 'react-native'
import Set from './Set'
import io from 'socket.io-client'

class Match extends Component {

  constructor(props) {
    super(props)

    matchData = this.props.navigation.state.params.matchData
    storageKey = 'match'+matchData.matchId

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
        AsyncStorage.setItem(storageKey, JSON.stringify(this.state))
      }
    })
  }

  componentDidMount() {
    this.wsSetup()
    AsyncStorage.getItem(storageKey)
    .then((dataStr) => {
      if (dataStr) {
        data = JSON.parse(dataStr)
        this.setState({
          gameData: data.gameData
        })
      } else {
        fetch('http://192.168.1.106:9988/match/'+matchData.matchId)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if (responseJson.length > 0) {
            newArray = this.state.gameData
            for (let i = 0; i < responseJson.length; i++) {
              newArray[responseJson[i].gameNo] = responseJson[i]
            }
            this.setState({
              gameData: newArray            
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
      }
    })
    .catch((err) => {
      console.log(err)
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
      AsyncStorage.setItem(storageKey, JSON.stringify(this.state))
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
            players={this.props.navigation.state.params.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={1} 
            type={2}
            numGames={4}
            startingGameNo={1} />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.props.navigation.state.params.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={2}
            type={1}
            numGames={8} 
            startingGameNo={5} />
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.props.navigation.state.params.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={3} 
            type={2}
            numGames={4}
            startingGameNo={13} />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.props.navigation.state.params.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={4}
            type={1}
            numGames={8} 
            startingGameNo={17} />
          <Set 
            setGameData={this.setGameData}
            gameData={this.state.gameData} 
            players={this.props.navigation.state.params.players}
            homeTeam={this.state.homeTeam}
            awayTeam={this.state.awayTeam}
            setNumber={5} 
            type={2}
            numGames={4}
            startingGameNo={25} />
          <Set
            setGameData={this.setGameData}
            gameData={this.state.gameData}
            players={this.props.navigation.state.params.players}
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