import React, { Component } from 'react'
import { Modal, View, Picker, Text, StyleSheet, Button } from 'react-native'

class PlayerPicker extends Component {
  constructor(props) {
    super(props)
    this.updatePlayer = this.updatePlayer.bind(this)
    this.closeModal = this.closeModal.bind(this)
    
    this.state = {
      showModal: true
    }
  }

  updatePlayer(playerId) {
    if (playerId != -2) {
      if (typeof this.props.setPlayer != 'undefined') {
        this.props.setPlayer(playerId)
      }
    } else {
      this.props.showAddPlayer()
    }
  }

  closeModal() {
    this.props.closePlayerPicker()
  }

  render() {      
    var players = this.props.team.teamPlayers
    var pickerItems = []
    players.map((playerId, i) => {
      player = this.props.players.getPlayer(playerId)
      var playerName = ''
      if (player) {
        playerName = player.playerName
      }
      pickerItems.push(
        <Picker.Item key={i} value={player.playerId} label={playerName} />
      )
    })
    return(
      <Modal animationType='slide' visible={this.state.showModal} onRequestClose={this.closeModal}>
        {this.state.playerId != -2 &&
          <View style={styles.modalView}>
            <Button onPress={this.closeModal} title="Cancel" />
            <Picker selectedValue={-1} onValueChange={this.updatePlayer}>
              <Picker.Item value={-1} label="Choose A Player" />
              {pickerItems}
              <Picker.Item value={-2} label="Add new Player" />
            </Picker>
          </View>
        }
      </Modal>
    )


  }
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor:'gray',
    height:300,
    marginTop:22
  }
})

export default PlayerPicker