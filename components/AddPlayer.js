import React, {Component} from 'react'
import {TextInput, View, Text, Modal, StyleSheet, TouchableHighlight} from 'react-native'

class AddPlayer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playerName: '',
      showModal: true
    }

    this.handleChangeText = this.handleChangeText.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.setName = this.setName.bind(this)
    this.guid = this.guid.bind(this)
  }

  handleChangeText(newName) {
    this.setState({
      playerName: newName
    })
  }

  closeModal() {
    this.props.closeAddPlayer()
  }

  setName() {    
    // save new player to db
    this.props.players.addNewPlayer(this.state.playerName)
    .then((player) => {
      this.props.addNewPlayer(player)
      this.closeModal()
    })
    .catch((err) => {  // if no network, create temp id
      console.log(err)
      let tempId = this.guid()
      let player = this.props.players.AddPlayer(tempId, this.state.playerName)
      this.props.addNewPlayer(player)
      this.closeModal()
    })
  }

  guid() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36)
  }

  render() {
    return(
      <Modal animationType='slide' visible={this.state.showModal} onRequestClose={this.closeModal}>
        <View style={styles.modalView}>
          <View>
            <TouchableHighlight onPress={this.closeModal} title='Cancel'>
              <View>
                <Text style={{fontWeight: 'bold', fontSize: 24, color:'black'}}>Cancel</Text>
              </View>
            </TouchableHighlight>
          </View>
          <View style={{paddingTop:10}}>
            <TextInput autoCorrect={false} onEndEditing={this.setName} autoFocus={true} maxLength={32} style={{height: 40, width: 250, fontSize: 24, color:'black', backgroundColor:'white'}} placeholder="Player Name" value={this.state.playerName} onChangeText={this.handleChangeText} />
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor:'gray',
    marginTop:22,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export default AddPlayer