import React, {Component} from 'react'
import {ScrollView, View, AsyncStorage, TouchableHighlight, Text} from 'react-native'
//import Matches from './Matches'
//import Match from './Match'

class ScoreSheets extends Component {
  constructor(props) {
    super(props)

    this.getMatches = this.getMatches.bind(this)
    this.handleScoreSheetChosenBtn = this.handleScoreSheetChosenBtn.bind(this)
    this.state = {
      matches: null
    }
    this.myTeamId = 0
  }

  componentDidMount() {
    AsyncStorage.getItem('matches').
    then((matchesStr) => {
      if (!matchesStr) {
          this.getMatches()
      } else {
        var matches = null;
        try {
          matches = JSON.parse(matchesStr)
          if (matches) {
            this.setState({
              matches: matches
            })
          } else {
            this.getMatches()
          }
        }
        catch(err) {
          console.log(err)
          this.getMatches()
        }
      } 
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleScoreSheetChosenBtn(matchData, homeTeam, awayTeam, players) {
    //console.log('pressed')
    //this.props.navigation.navigate('ScoreSheet', {matchData: matchData, homeTeam: homeTeam, awayTeam: awayTeam, players: players})
    this.props.navigation.navigate('Match', {matchData: matchData, homeTeam: homeTeam, awayTeam: awayTeam, players:players})
  }

  getMatches() {
    let theDate = new Date()
    let futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 3)
    
    matches = [
      {matchId: 1, matchDate: theDate, homeTeamId: 0, awayTeamId: 1, matchType: 'nine', round: 1},
      {matchId: 2, matchDate: theDate, homeTeamId: 0, awayTeamId: 2, matchType: 'eight', round: 1},
      {matchId: 3, matchDate: theDate, homeTeamId: 0, awayTeamId: 3, matchType: 'mixed', round: 1},
      {matchId: 4, matchDate: theDate, homeTeamId: 2, awayTeamId: 3, matchType: 'nine', round: 1},
      {matchId: 5, matchDate: futureDate, homeTeamId: 0, awayTeamId: 1, matchType: 'mixed', round: 1},
    ]

    /*
    matches.push({date: new Date(), type: 'mixed', homeTeamId: 0, awayTeamId: 1, matchId: 1})
    matches.push({date: new Date(), type: 'eight', homeTeamId: 0, awayTeamId: 2, matchId: 2})
    matches.push({date: new Date(), type: 'nine', homeTeamId: 0, awayTeamId: 3, matchId: 3})
    matches.push({date: new Date(), type: 'mixed', homeTeamId: 2, awayTeamId: 3, matchId: 4})
    matches.push({date: futureDate, type: 'mixed', homeTeamId: 0, awayTeamId: 1, matchId: 5})
    */
    this.setState({
      matches: matches
    })
  }

  render() {
    var rows = []
    var today = new Date();
    teams = this.props.navigation.state.params.teams  
    players = this.props.navigation.state.params.players  
    //console.log(players)
    today.setHours(0,0,0,0)
    if (this.state.matches) {
      this.state.matches.map((aMatch, i) => {
        aMatch.matchDate.setHours(0,0,0,0)
        homeTeam = teams.getTeam(aMatch.homeTeamId)
        awayTeam = teams.getTeam(aMatch.awayTeamId)
        if (aMatch.matchDate.getTime() == today.getTime() && (aMatch.homeTeamId == this.myTeamId || aMatch.awayTeamId == this.myTeamId)) {
          var gameTitle = awayTeam.teamName + ' VS @' + homeTeam.teamName
          rows.push(
            <TouchableHighlight key={i} onPress={()=>this.handleScoreSheetChosenBtn(aMatch, homeTeam, awayTeam, players)}>
              <View>
                <Text>{aMatch.matchDate.toDateString()}</Text>
                <Text>{gameTitle}</Text>
              </View>
            </TouchableHighlight>
          )
        }
        else {
          if (aMatch.matchDate > today && (aMatch.homeTeamId == this.myTeamId || aMatch.awayTeamId == this.myTeamId)) {
            var gameTitle = awayTeam.teamName + ' VS @' + homeTeam.teamName
            rows.push(
              <View key={i}>
                <Text style={{color:'gray'}}>{aMatch.matchDate.toDateString()}</Text>
                <Text style={{color:'gray'}}>{gameTitle}</Text>
              </View>
            )
          }
        }
      })
    }
    return(
      <ScrollView>
        {rows}
      </ScrollView>
    )
  }
}

export default ScoreSheets