<template>
  <nb-container :style="{backgroundColor: '#fff'}">
    <nb-header>
      <nb-left>
        <nb-button transparent :on-press={() => this.navigation.goBack()}>
          <nb-icon name="arrow-back"></nb-icon>
        </nb-button>
      </nb-left>
      <nb-body>
        <nb-title>
          {{userChat.name}}
        </nb-title>
      </nb-body>
      <nb-right></nb-right>
    </nb-header>
    <nb-content padder>
      <nb-grid :style="styleObj.boxContent">
        <nb-row :size="92">
          <flat-list
            :refreshing="isFetching"
            :on-refresh="() => loadMessages()"
            :data="Object.values(messages)"
            :render-item="(item) => renderList(item)"
            :key-extractor="(item, index) => index.toString()"
          />
        </nb-row>
        <nb-row :size="8" :style="styleObj.boxChat">
          <nb-item inlineLabel :style="{width: 300}">
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
import moment from 'moment'
import { AsyncStorage, Dimensions } from 'react-native'
import {
  Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right,
  Button, Toast, Icon, View, RefreshControl
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import { StackNavigator } from 'vue-native-router'
import { firebaseApp } from '../../database/firebase'
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
      database: firebaseApp.database(),
      userRef: firebaseApp.database().ref('users'),
      messageRef: firebaseApp.database().ref('messages'),
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
          backgroundColor: '#0f0',
          marginBottom: 2
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
        time: {
          alignSelf: 'flex-end',
          margin: 15,
          fontSize:12,
          color:"#fff",
          backgroundColor: '#000',
          width: 120
        },
        boxContent: {
          height: 700
        }
      },
      userId: '',
      userIdChart: '',
      user_to: [],
      users: [],
      messages: {},
      message: '',
      userChat: {},
      isFetching: false,
      showTimeofMessage: true,
      height: Dimensions.get('window').height
    }
  },
  async created() {
    await this.loadUserId()
    let userIdChat = await this.loadUserIdChat()
    await this.loadUserChat(userIdChat)
    this.loadMessages()
  },
  methods: {
    async loadUserIdChat() {
      let userId = ''
      await AsyncStorage.getItem('userChat').then((value) => {
        if (value) {
          userId = value
        }
      })
      return this.userId = userId
    },
    async loadUserId() {
      let userId = ''
      await AsyncStorage.getItem('userId').then((value) => {
        if (value) {
          userId = value
        }
      })
      return this.userIdChart = userId
    },
    async loadUserChat(userId) {
      let user = {}
      await this.userRef.orderByKey().once('value')
                        .then(snapshot => {
                          snapshot.forEach(function(childSnapshot) {
                            if (userId === childSnapshot.key) {
                              user = childSnapshot.val()
                            }
                          })
                        })
      return this.userChat = user
    },
    async loadMessages() {
      let _this = this
      await this.messageRef.orderByChild('date_created').on('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
          let message = childSnapshot.val()
          if (_this.messageSent(message) || _this.messageReceived(message)) {
            let type = _this.messageReceived(message) ? 'received' : 'sent'
            _this.messages[childSnapshot.key] = { ...message, ...{ type: type } }
          }
          _this.isFetching = true
        })
      })
    },
    messageSent(message) {
      return message.user_from === this.userId
            && message.user_to === this.userIdChart
    },
    messageReceived(message) {
      return message.user_to === this.userId
            && message.user_from === this.userIdChart
    },
    sendMessage() {
      if (this.message === '') return
      this.addDbMessage(this.message)
      this.message = ''
    },
    addDbMessage(message, user_to) {
      let messageObj = {
        message: message,
        type: 'sent',
        user_to: this.userIdChart,
        user_from : this.userId,
        date_created: moment().format('YYYY-MM-DD H:mm:ss')
      }
      this.messages[this.setAutoTimeId()] = messageObj
      this.database.ref('messages/' + this.setAutoTimeId()).set(messageObj)
    },
    setAutoTimeId() {
      return (new Date()).getTime()
    },
    renderList: function(item) {
      let inMessage = item.item.type === 'sent'
      let itemStyle = inMessage ? this.styleObj.itemIn : this.styleObj.itemOut
      let messageStyle = inMessage ? this.styleObj.messageSent : this.styleObj.messageReceived
      return (
        <View style={[itemStyle]}>
          <View style={[this.styleObj.balloon, messageStyle]} >
            <Text onPress={() => {this.showTimeofMessage=true}}>{item.item.message}</Text>
          </View>
        </View>
      )
    }
  }
}
</script>
