import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueTextareaAutoSize from 'vue-textarea-autosize'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

firebase.initializeApp({
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER,
  appId: process.env.VUE_APP_FIREBASE_APP_ID
})

firebase.auth().onAuthStateChanged(user => {
  store.dispatch('fetchUser', user)
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
