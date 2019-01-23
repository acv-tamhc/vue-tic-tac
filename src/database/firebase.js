import * as firebase from 'firebase'
const CONFIG = {
  apiKey: 'AIzaSyDXM1huEl55trlVd9TNEsClql6CQAfrV1g',
  authDomain: 'vue-tic-tac.firebaseapp.com',
  databaseURL: 'https://vue-tic-tac.firebaseio.com',
  projectId: 'vue-tic-tac',
  storageBucket: 'vue-tic-tac.appspot.com',
  messagingSenderId: '470795417656'
}
export const firebaseApp = firebase.initializeApp(CONFIG)
