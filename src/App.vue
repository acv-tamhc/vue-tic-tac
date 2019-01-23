<template>
  <root>
    <app-navigation></app-navigation>
  </root>
</template>

<script>
import Vue from 'vue-native-core'
import { Root } from 'native-base'
import { Dimensions, Platform, SafeAreaView } from "react-native"
import { StackNavigator, DrawerNavigator, navigationService } from 'vue-native-router'
// validator
import Vuelidate from 'vuelidate'
// screen
import UserSignin from './screens/users/signin.vue'
import UserSignout from './screens/users/signout.vue'
import HomeScreen from './screens/home/home.vue'
import UserProfile from './screens/users/profile.vue'
import ChattingHome from './screens/chatting/home.vue'
import ChattingMessage from './screens/chatting/message.vue'

const Drawer = DrawerNavigator(
  {

    Home: { screen: HomeScreen },
    Profile: { screen: UserProfile },
    Chatting: { screen: ChattingHome },
    Message: { screen: ChattingMessage },
    Signout: { screen: UserSignout }
  },
  {
    initialRouteName: 'Home',
    // contentComponent: CustomDrawerNavigator
  }
)

const AppNavigation = StackNavigator(
  {
    Signin: { screen: UserSignin },
    Drawer: { screen: Drawer }
  },
  {
    initialRouteName: 'Signin',
    headerMode: 'none'
  }
)
Vue.use(Vuelidate)
export default {
  components: { Root, AppNavigation, SafeAreaView },
  props: {
    navigation: {
      type: Object
    }
  },
}
</script>
