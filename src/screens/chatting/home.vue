<template>
  <nb-container :style="{backgroundColor: '#fff'}">
    <nb-header>
      <nb-body>
        <nb-title>
          <nb-card-item :style="styleObj.nbCard">
              <nb-left>
                <nb-thumbnail :source="chatPng"></nb-thumbnail>
                <nb-text note :style="styleObj.nbTitle">Chat</nb-text>
              </nb-left>
          </nb-card-item>
        </nb-title>
      </nb-body>
    </nb-header>
    <nb-content padder>
      <nb-item>
        <nb-icon active name="search" />
        <nb-input placeholder="Search" />
        <nb-icon active name="people" />
      </nb-item>
      <flat-list
        :data="users"
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
      user_to: [],
      users: [],
      messages: {}
    }
  },
  async created() {
    let user_to = await this.loadListFriends()
    await this.loadMessages()
    this.loadUsers(user_to)
  },
  methods: {
    openDrawerMenu() {
      this.navigation.navigate('Home')
    },
    renderList: function(item) {
      let avatar = item.item.avatar
      return (
        <ListItem thumbnail>
          <Left>
            <Thumbnail source={chatPng} />
          </Left>
          <Body>
            <Text>{item.item.name}</Text>
            <Text>{this.messageOfUser(item.item.id)}</Text>
          </Body>
          <Right>
            <Button transparent onPress={() => this.sendMessages(item.item.id)}>
              <Text>View</Text>
            </Button>
          </Right>
        </ListItem>
      )
    },
    async loadUsers(user_to) {
      let users = []
      await this.userRef.orderByKey().once('value')
                        .then(snapshot => {
                          snapshot.forEach(function(childSnapshot) {
                            let user = childSnapshot.val()
                            if (user_to.includes(childSnapshot.key)) {
                              users.push({ ...user, ...{ id: childSnapshot.key }})
                            }
                          })
                        })
        this.users = users
    },
    async loadListFriends() {
      let user_to = []
      await this.messageRef.once('value')
                    .then(snapshot => {
                      snapshot.forEach(function(childSnapshot) {
                        let message = childSnapshot.val()
                        if (!user_to.includes(message.user_to)) {
                          user_to.push(message.user_to)
                        }
                      })
                    })
      return this.user_to = user_to
    },
    async loadMessages() {
      let this_messages = this.messages
      await this.messageRef.once('value')
                    .then(snapshot => {
                      snapshot.forEach(function(childSnapshot) {
                        let message = childSnapshot.val()
                        let messages = []
                        if (messages.includes(message.user_to)) { messages =  this_messages[message.user_to] }
                        messages.push(message)
                        this_messages[message.user_to] = messages
                      })
                    })
      return this.messages = this_messages
    },
    messageOfUser(user_id) {
      return this.messages[user_id][0].message || 'message'
    },
    sendMessages(user_id) {
      AsyncStorage.setItem('userChat', user_id)
      this.navigation.navigate('Message')
    }
  }
}
</script>
