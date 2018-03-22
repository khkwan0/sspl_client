import React, {Component} from 'react'
import {ScrollView, View, StyleSheet, Text} from 'react-native'
import Set from './Set'

class Match extends Component {

  constructor(props) {
    super(props)

    matchData = this.props.navigation.state.params.matchData
    console.log(matchData)

    this.state = {
      matchId: matchData.matchId,
      matchDate: matchData.matchDate,
      homeTeam: this.props.navigation.state.params.homeTeam,
      awayTeam: this.props.navigation.state.params.awayTeam,
      matchType: matchData.matchType,
      season: matchData.season,
      round: matchData.round,
      gameData: new Array(36)
    }
    this.setGameData = this.setGameData.bind(this)
  }

  setGameData(gameData) {
    newArray = this.state.gameData
    newArray[gameData.gameNo] = gameData
    this.setState({
      gameData: newArray
    })
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
            homeTeam={this.state.homeTeam} awayTeam={this.state.awayTeam}
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
        </View>
      )
    } else {
      toRender = ''
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