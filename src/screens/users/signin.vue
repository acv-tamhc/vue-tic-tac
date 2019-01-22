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
import firebase from '../../database/firebase'
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
      emailValue: 'admin',
      password: 'admin',
      loaded: false,
      logging_in: false,
      userRef: firebase.database().ref('users'),
      storeState: store.state
    }
  },
  created() {
    this.loaded = true
    AsyncStorage.getItem('email').then((value) => {
      if (value) {
        this.navigation.navigate('Home')
        this.loaded = false
      } else {
        this.loaded = true
      }
    })
  },
  methods: {
    login() {
      let email = this.emailValue
      let password = md5(this.password)
      this.userRef.orderByKey().once('value')
                  .then(snapshot => {
                    snapshot.forEach(function(childSnapshot) {
                      let user = childSnapshot.val()
                      if (email === user.email &&  password === user.password) {
                        this.loaded = true
                        store.updateUser({...user, ...{ id: childSnapshot.key }})
                        AsyncStorage.setItem('email', email)
                        this.navigation.navigate('Home')
                      }
                    })
                  })
    },
  }
}
</script>
