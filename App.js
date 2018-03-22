import React, {Component} from 'react'
import { StackNavigator } from 'react-navigation'
import ScoreSheet from './components/ScoreSheet'
import ScoreSheets from './components/ScoreSheets'
import Archives from './components/Archives'
import HomeAwayPicker from './components/HomeAwayPicker'
import HomeScreen from './components/HomeScreen'
import ConfirmDate from './components/ConfirmDate'
import ChooseTeam from './components/ChooseTeam'
import Match from './components/Match'

const RootStack = StackNavigator(
  {
    HomeScreen: { screen: HomeScreen},
    ScoreSheets: {screen: ScoreSheets},
    Archives: {screen: Archives},
    HomeAwayPicker: {screen: HomeAwayPicker},
    ConfirmDate: {screen: ConfirmDate},
    ChooseTeam: {screen:ChooseTeam},
    Match: {screen:Match}
  },
  {
    initialRouteName: 'HomeScreen'
  }  
)

class App extends Component {
  render() {
    return <RootStack />
  }
}
    
export default App