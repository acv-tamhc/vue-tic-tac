<template>
  <nb-container :style="{backgroundColor: '#fff'}">
    <nb-header>
      <nb-body>
        <nb-title>
          User profile
        </nb-title>
      </nb-body>
    </nb-header>
    <nb-content padder>
      <nb-form>
        <nb-text>Email: abc@gmail.com</nb-text>
        <nb-text>Password: ******</nb-text>
        <nb-button primary iconLeft light
          :style="{marginBottom: 20}"
          :on-press="openDrawerMenu">
          <nb-icon name="home" />
          <nb-text>Home</nb-text>
        </nb-button>
      </nb-form>
    </nb-content>
  </nb-container>
</template>
<script>
import { Toast, Icon } from 'native-base'
import { AsyncStorage } from 'react-native'
import { StackNavigator } from 'vue-native-router'
// import store from '../store'

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data: function() {
    return {
    }
  },
  created() {
  },
  methods: {
    openDrawerMenu() {
      this.navigation.navigate('Home')
    }
  }
}
</script>
