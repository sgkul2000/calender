import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueTextareaAutoSize from 'vue-textarea-autosize'
import firebase from 'firebase/app'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: 'AIzaSyD9MPUaj4oY9Bte5OwkrgooreWMyN43joc',
  authDomain: 'calender-cf9da.firebaseapp.com',
  databaseURL: 'https://calender-cf9da.firebaseio.com',
  projectId: 'calender-cf9da',
  storageBucket: 'calender-cf9da.appspot.com',
  messagingSenderId: '1094402367030',
  appId: '1:1094402367030:web:8cd31c98bedb0f818a0297'
})

Vue.use(VueTextareaAutoSize)

Vue.config.productionTip = false

export const db = firebase.firestore()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
