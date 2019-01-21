<template>
  <view class="container">
    <app-loading v-if="!isAppReady" />
    <app v-if="isAppReady" />
  </view>
</template>

<script>
import Vue from "vue-native-core"
import { VueNativeBase } from "native-base"
import { AppLoading } from 'expo'
import App from "../App.vue"

Vue.use(VueNativeBase)
export default {
  components: { App, AppLoading },
  data: function() {
    return {
      isAppReady: false
    }
  },
  created: function() {
    this.loadFonts()
  },
  methods: {
    loadFonts: async function() {
      try {
        this.isAppReady = false
        await Expo.Font.loadAsync({
          Roboto: require("native-base/Fonts/Roboto.ttf"),
          Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
          Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
        })
        this.isAppReady = true
      } catch (error) {
        this.isAppReady = true
      }
    }
  }
}
</script>

<style lang="scss">
.container {
  flex: 1
}
.wrapper {
  width: 100%
}
</style>
