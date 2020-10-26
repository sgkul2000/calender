<template>
  <v-app>
    <v-app-bar
      absolute
      color="white"
      elevate-on-scroll
      app
    >
      <v-toolbar-title style="cursor: pointer;" @click="$router.push({name:'Home'})">Calender app</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn class="mx-4" v-if="user.loggedIn === false && $route.name !== 'Login'" @click="$router.push({name:'Login'})" >
        Login
      </v-btn>
      <v-btn class="mx-4" v-if="user.loggedIn === false  && $route.name !== 'Register'" @click="$router.push({name:'Register'})" >
        Register
      </v-btn>
      <v-btn class="mx-4" v-if="user.loggedIn === true" @click="logout" color="error">
        Logout
      </v-btn>
      <v-btn icon @click="$router.push({name: 'About'})">
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data: () => ({
    //
  }),

  components: {
  },
  methods: {
    logout () {
      firebase.auth().signOut().then(() => [
        this.$router.push({
          name: 'Login'
        })
      ]).catch(err => {
        console.error(err)
        alert(err)
      })
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    })
  },
  mounted () {
    console.log(this.user)
  }
}
</script>
