import React, {Component} from 'react'
import {View, Picker, Button} from 'react-native'

class ChooseTeam extends Component {
  constructor(props) {
    super(props)

    this.selectTeam = this.selectTeam.bind(this)   
  }

  selectTeam(teamId) {
    this.props.navigation.state.params.setTeam(teamId)
    this.props.navigation.goBack()
  }

  render() {
    teams = this.props.navigation.state.params.teams
    teamDisplay = []
    if (teams) {
      i = 0;
      while (i < teams.length) {
        teamDisplay.push(
          <Picker.Item key={i} label={teams[i].teamName} value={teams[i].teamId} />
        )
        i++
      }
    }
    return(
      <View>
        <Picker selectedValue={-1} onValueChange={this.selectTeam}>
          <Picker.Item label="Select Team" value={-1} />
          {teamDisplay}
        </Picker>
      </View>
    )
  }
}

export default ChooseTeam