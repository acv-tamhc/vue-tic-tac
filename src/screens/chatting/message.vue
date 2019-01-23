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
            :refreshing="isFetching"
            :data="messages"
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
      user_id: '',
      user_id_chart: '',
      user_to: [],
      users: [],
      messages: [],
      message: '',
      userChat: {},
      isFetching: false,
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
      let _this = this
      await this.messageRef.orderByChild('date_created').on('value', (snapshot) => {
        snapshot.forEach(function(childSnapshot) {
          let message = childSnapshot.val()
          if (messageSent(message) || messageReceived(message)) {
            let type = messageReceived(message) ? 'received' : 'sent'
            _this.messages.push({ ...message, ...{ type: type } })
          }
          _this.isFetching = true
        })
      })
    },
    messageSent(message) {
      return message.user_from === this.user_id
            && message.user_to === this.user_id_chart
    },
    messageReceived(message) {
      return message.user_to === this.user_id
            && message.user_from === this.user_id_chart
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
        user_to: this.user_id_chart,
        user_from : this.user_id,
        date_created: moment().format('YYYY-MM-DD H:mm:ss')
      }
      this.messages.push(messageObj)
      this.database.ref('messages/' + this.setAutoTimeId()).set(messageObj)
    },
    setAutoTimeId() {
      return (new Date()).getTime()
    },
    renderList: function(item) {
      let inMessage = item.item.type === 'sent'
      let itemStyle = inMessage ? this.styleObj.itemIn : this.styleObj.itemOut
      let messageStyle = inMessage ? this.styleObj.messageSent : this.styleObj.messageReceived
      let formatDate = this.formatDate
      return (
        <View style={[itemStyle]}>
          <Text style={this.styleObj.time}>
            {item.item.date_created}
          </Text>
          <View style={[this.styleObj.balloon, messageStyle]}>
            <Text>{item.item.message}</Text>
          </View>
        </View>
      )
    }
  }
}
</script>
