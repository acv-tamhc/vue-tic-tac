<template>
</template>
<script>
import { AsyncStorage } from 'react-native'
import { StackNavigator } from 'vue-native-router'
import { Toast } from 'native-base'
import { firebaseApp } from '../../database/firebase'
import { store } from '../../store/store'

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data: function() {
    return {
      storeState: store.state
    }
  },
  created() {
    firebaseApp.auth().signOut().then(function() {
      this.navigation.navigate('Signin')
    }).catch(function(error) {
      this.navigation.navigate('Signin')
    })
    AsyncStorage.removeItem('userId')
  }
}
</script>
