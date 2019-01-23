<template>
  <nb-container :style="{backgroundColor: '#fff'}">
    <nb-header>
      <nb-body>
        <nb-title>
          {{userChat.name}}
        </nb-title>
      </nb-body>
    </nb-header>
    <nb-content padder>
      <nb-grid :style="styleObj.boxContent">
        <nb-row :size="92">
          <flat-list
            :data="messages"
            :render-item="(item) => renderList(item)"
            :key-extractor="(item, index) => index.toString()"
          />
        </nb-row>
        <nb-row :size="8" :style="styleObj.boxChat">
          <nb-item inlineLabel :style="{width: 350}">
            <nb-input
              style="{styleObj.input}"
              placeholder="Write a message..."
              underlineColorAndroid='transparent'
              v-model="message"
              />
              <nb-button transparent :on-press="sendMessage">
                <image
                  :source="{uri:'https://png.icons8.com/small/75/ffffff/filled-sent.png'}"
                  :style="styleObj.imageSend"
                />
            </nb-button>
          </nb-item>
        </nb-row>
      </nb-grid>
    </nb-content>
  </nb-container>
</template>
<script>
import React from 'react'
import { AsyncStorage, Dimensions } from 'react-native'
import {
  Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right,
  Button, Toast, Icon, View
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { StackNavigator } from 'vue-native-router'
import firebase from '../../database/firebase'
import { store } from '../../store/store'
import chatPng from "../../../assets/chat.png"

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data: function() {
    return {
      userRef: firebase.database().ref('users'),
      messageRef: firebase.database().ref('messages'),
      storeState: store.state,
      chatPng: chatPng,
      styleObj:{
        nbCard: {
          width: '100%'
        },
        nbTitle: {
          fontSize: 20,
          fontWeight: 'bold'
        },
        balloon: {
          maxWidth: 250,
          padding: 15,
          borderRadius: 20,
          backgroundColor: '#0f0'
        },
        itemIn: {
          alignSelf: 'flex-start'
        },
        itemOut: {
          alignSelf: 'flex-end'
        },
        input: {
          height: 40,
          marginLeft: 16,
          borderBottomColor: '#FFFFFF',
          flex: 1,
          backgroundColor: '#0f0'
        },
        imageSend: {
          width: 20,
          height: 20
        },
        boxChat: {
          borderRadius: 10,
          backgroundColor: '#00BFFF'
        },
        messageReceived: {
          backgroundColor: '#f1f1f1'
        },
        messageSent: {
          backgroundColor: '#00BFFF'
        },
        boxContent: {
          height: 700, /** change follow percent app */
          // backgroundColor: '#00f'
        }
      },
      user_id: '',
      user_id_chart: '',
      user_to: [],
      users: [],
      messages: [],
      message: '',
      userChat: {},
      height: Dimensions.get('window').height
    }
  },
  async created() {
    await this.loadUserId()
    let userIdChat = await this.loadUserIdChat()
    await this.loadUserChat(userIdChat)
    await this.loadMessages()
  },
  methods: {
    async loadUserIdChat() {
      let user_id = ''
      await AsyncStorage.getItem('userChat').then((value) => {
        if (value) {
          user_id = value
        }
      })
      return this.user_id = user_id
    },
    async loadUserId() {
      let user_id = ''
      await AsyncStorage.getItem('userId').then((value) => {
        if (value) {
          user_id = value
        }
      })
      return this.user_id_chart = user_id
    },
    async loadUserChat(user_id) {
      let user = {}
      await this.userRef.orderByKey().once('value')
                        .then(snapshot => {
                          snapshot.forEach(function(childSnapshot) {
                            if (user_id === childSnapshot.key) {
                              user = childSnapshot.val()
                            }
                          })
                        })
      return this.userChat = user
    },
    async loadMessages() {
      let messages = []
      let messageSent = this.messageSent
      let messageReceived = this.messageReceived
      await this.messageRef.once('value')
                    .then(snapshot => {
                      snapshot.forEach(function(childSnapshot) {
                        let message = childSnapshot.val()
                        if (messageSent(message) || messageReceived(message) ) {
                          let type = messageReceived(message) ? 'received' : 'sent'
                          messages.push({ ...message, ...{ type: type } })
                        }
                      })
                    })
      return this.messages = messages
    },
    messageSent(message) {
      return message.user_from === this.user_id
            && message.user_to === this.user_id_chart
    },
    messageReceived(message) {
      return message.user_to === this.user_id
            && message.user_from === this.user_id_chart
    },
    renderList: function(item) {
      let inMessage = item.item.type === 'sent'// messages left or right
      let itemStyle = inMessage ? this.styleObj.itemIn : this.styleObj.itemOut
      let messageStyle = inMessage ? this.styleObj.messageSent : this.styleObj.messageReceived
      return (
        <View style={[itemStyle]}>
          <View style={[this.styleObj.balloon, messageStyle]}>
            <Text>{item.item.message}</Text>
          </View>
        </View>
      )
    },
    sendMessage() {
      console.log('send message')
    }
  }
}
</script>