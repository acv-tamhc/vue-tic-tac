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
    <nb-footer>
      <nb-footer-tab>
        <nb-button>
          <nb-icon name="home" />
        </nb-button>
        <nb-button>
          <nb-icon name="chatbubbles" />
        </nb-button>
        <nb-button :active="true">
          <nb-icon name="home" />
        </nb-button>
        <nb-button>
          <nb-icon name="contact" />
        </nb-button>
      </nb-footer-tab>
    </nb-footer>
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
        }
      },
      user_to: [],
      users: [],
      messages: {},
      userIdCurrent: ''
    }
  },
  async created() {
    await this.loadUserId()
    let user_to = await this.loadListFriends()
    await this.loadMessages()
    await this.loadUsers(user_to)
  },
  methods: {
    async loadUserId() {
      let _this = this
      await AsyncStorage.getItem('userId').then((value) => {
        if (value) {
          _this.userIdCurrent = value
        }
      })
    },
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
      let _this = this
      await this.userRef.orderByKey().on('value', snapshot => {
                          snapshot.forEach(function(childSnapshot) {
                            let user = childSnapshot.val()
                            if (_this.user_to.includes(childSnapshot.key) && childSnapshot.key !== _this.userIdCurrent) {
                              _this.users.push({ ...user, ...{ id: childSnapshot.key }})
                            }
                          })
                        })
    },
    async loadListFriends() {
      let _this = this
      await this.messageRef.orderByChild('date_created').on('value', snapshot => {
                      snapshot.forEach(function(childSnapshot) {
                        let message = childSnapshot.val()
                        if (!_this.user_to.includes(message.user_to)) {
                          _this.user_to.push(message.user_to)
                        }
                      })
                    })
    },
    async loadMessages() {
      let _this = this
      await this.messageRef.orderByChild('date_created').on('value', snapshot => {
                      snapshot.forEach(function(childSnapshot) {
                        _this.messages[childSnapshot.key] = childSnapshot.val()
                      })
                    })
    },
    messageOfUser(user_id) {
      // return true
      return Object.values(this.messages).reverse().find(message => message.user_to === user_id).message
    },
    sendMessages(user_id) {
      AsyncStorage.setItem('userChat', user_id)
      this.navigation.navigate('Message')
    }
  }
}
</script>
