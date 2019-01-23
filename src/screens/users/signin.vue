<template>
  <nb-container v-if="loaded" :style="{backgroundColor: '#fff'}">
    <nb-header>
      <nb-body>
        <nb-title>
          Sign In
        </nb-title>
      </nb-body>
    </nb-header>
    <nb-content padder>
      <nb-form>
        <nb-item>
          <nb-input
            placeholder="Email"
            v-model="emailValue"
            auto-capitalize="none"
            :on-blur="() => $v.emailValue.$touch()" />
        </nb-item>
        <nb-item last>
          <nb-input
            placeholder="Password"
            v-model="password"
            auto-capitalize="none"
            secure-text-entry :on-blur="() => $v.password.$touch()" />
        </nb-item>
      </nb-form>
      <view :style="{marginTop:10}">
        <nb-button block :on-press="login">
          <nb-spinner v-if="logging_in" size="small" />
          <nb-text>Login</nb-text>
        </nb-button>
      </view>
    </nb-content>
  </nb-container>
  <nb-spinner v-if="!loaded"></nb-spinner>
</template>
<script>
import { AsyncStorage } from 'react-native'
import { StackNavigator } from 'vue-native-router'
import { Toast } from 'native-base'
import { required, email } from 'vuelidate/lib/validators'
import md5 from 'md5'
import { firebaseApp } from '../../database/firebase'
import { store } from '../../store/store'

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  validations: {
    emailValue: {
      required,
      email
    },
    password: {
      required
    }
  },
  data: function() {
    return {
      emailValue: 'admin@mail.com',
      password: 'admin123',
      loaded: false,
      logging_in: false,
      userRef: firebaseApp.database().ref('users'),
      storeState: store.state
    }
  },
  created() {
    this.loaded = true
    firebaseApp.auth().onAuthStateChanged((user) => {
      if (user != null) {
        AsyncStorage.setItem('userId', user.uid)
        this.navigation.navigate('Chatting')
        this.loaded = false
      } else {
        this.loaded = true
      }
    })
  },
  methods: {
    async login() {
      let email = this.emailValue
      // let password = md5(this.password)
      let password = this.password
      let hasError = false
      await firebaseApp.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code
        var errorMessage = error.message
        this.refs.toast.show(<View><Text>{errorMessage}</Text></View>)
      });
    }
  }
}
</script>
