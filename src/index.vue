<template>
  <root>
    <nb-container>
      <nb-header />
      <nb-grid>
        <nb-row :style="{ backgroundColor: '#635DB7' }" :size="75">
          <flat-list
            :style="{ backgroundColor: '#fff'}"
            :data="listViewData"
            :refreshing="state.refreshing"
            on-refresh="_onRefresh"
            >
            <view render-prop-fn="renderItem" >
              <text>{{args.item.key}}</text>
            </view>
            <view
              render-prop="ListFooterComponent"
              :style="{
                paddingVertical: 20,
                borderTopWidth: 1,
                borderColor: '#CED0CE'}">
            </view>
          </flat-list>
        </nb-row>
        <nb-row :style="{ backgroundColor: '#fff' }" :size="25">
          <nb-content>
            <nb-form>
              <nb-textarea v-model='message' full :rowSpan="4" bordered placeholder="Enter messages" />
              <nb-button full :onPress="sendMessages">
                <nb-text>Send</nb-text>
              </nb-button>
            </nb-form>
          </nb-content>
        </nb-row>
      </nb-grid>
    </nb-container>
  </root>
</template>

<script>
import React from "react"
import { ListView, AsyncStorage, RefreshControl, FlatList } from "react-native"
import { Col, Row, Grid } from 'react-native-easy-grid'
import {
  Button, Icon, Text, ListItem, Root,
  Form, Item, Input, Textarea
} from "native-base"

export default {
  components: { Root },
  data () {
    return {
      ds: new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 }),
      basic: true,
      listViewData: [{key: 'a'}, {key: 'b'}],
      message: '',
      loading: false,
      messageIndex: 0,
      state: {
        refreshing: false
      }
    }
  },
  methods: {
    _onRefresh () {
      console.log( this.state.refreshing)
      this.state.refreshing = false
    },
    renderRefreshControl: function() {
      render (
        <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
      )
    },
    getListArr: function() {
      // AsyncStorage.getItem('messages').then((result) => {
      //   if (result == '' || result == undefined) return
      //   this.listViewData = JSON.parse(result)
      // })
      // this.listViewData = JSON.parse(AsyncStorage.getItem('messages'))
      // return this.ds.cloneWithRows(this.listViewData);
      console.log(this.listViewData)
      return this.listViewData
    },
    sendMessages: function() {
      if (this.message.length) {
        this.listViewData.push(this.message)
        AsyncStorage.setItem('messages', JSON.stringify(this.listViewData))
        this.message = ''
      }
    }
  }
};
</script>
