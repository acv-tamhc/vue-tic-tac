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
      <flat-list
        :data="messages"
        :render-item="(item) => renderList(item)"
        :key-extractor="(item, index) => index.toString()"
      />
    </nb-content>
  </nb-container>
</template>
<script>
import React from 'react'
import { AsyncStorage } from 'react-native'
import {
  Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right,
  Button, Toast, Icon
} from 'native-base'
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
        }
      },
      user_id: '',
      user_id_chart: '',
      user_to: [],
      users: [],
      messages: {},
      userChat: {}
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
      let messageUserFromTo = this.messageUserFromTo
      await this.messageRef.once('value')
                    .then(snapshot => {
                      snapshot.forEach(function(childSnapshot) {
                        let message = childSnapshot.val()
                        if (messageUserFromTo(message)) {
                          messages.push(message)
                        }
                      })
                    })
      return this.messages = messages
    },
    messageUserFromTo(message) {
      return message.user_from === this.user_id
            && message.user_to === this.user_id_chart
    },
    renderList: function(item) {
      return (
        <ListItem thumbnail>
          <Left>
            <Thumbnail source={chatPng} />
          </Left>
          <Body>
            <Text>{item.item.message}</Text>
          </Body>
        </ListItem>
      )
    },
  }
}
</script>
