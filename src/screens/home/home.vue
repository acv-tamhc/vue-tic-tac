<template>
  <nb-container :style="{flex:1, backgroundColor: '#fff'}">
    <nb-header>
      <nb-left>
        <nb-button
          iconLeft
          transparent
          :on-press="openMenu"
        >
          <nb-icon active name="home" />
          <nb-text>Home</nb-text>
        </nb-button>
      </nb-left>
      <nb-body>
        <nb-title>Post</nb-title>
      </nb-body>
      <nb-right />
    </nb-header>
    <nb-content>
      <nb-list>
        <nb-item>Item</nb-item>
      </nb-list>
    </nb-content>
  </nb-container>
</template>

<script>
import Vue from "vue-native-core"
import {
  Root, Container, Header, Title, Content, Button, Left, Right, Body,
  Icon, Text, List, Item
} from "native-base"

export default {
  props: {
    navigation: Object
  },
  methods: {
    openMenu() {
      this.navigation.navigate('DrawerOpen')
    }
  }
}
</script>
