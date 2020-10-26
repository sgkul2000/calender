<template>
  <div id="loginMain">
    <v-row no-gutters>
      <v-col :align-self="'center'">
        <v-card
          :loading="loading"
          class="mx-auto my-12 px-4"
          max-width="500px"
          outlined
          :elevation="15"
        >
          <v-form
            v-model="isValid"
            class="py-4"
          >
            <v-card-title>Login</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.email"
                :rules="[rules.required, rules.email]"
                label="E-mail"
                :disabled="loading"
              />
              <v-text-field
                v-model="form.password"
                :append-icon="isPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :type="isPassword ? 'text' : 'password'"
                :rules="[rules.required, rules.password]"
                label="Password"
                required
                :disabled="loading"
                @click:append="isPassword = !isPassword"
              />
              <v-btn
                elevation="3"
                large
                text
                block
                depressed
                color="primary"
                :loading="loading"
                class="mb-5"
                @click="submitForm"
              >
                Login
              </v-btn>
              <div style="text-align:center">or</div>
              <!-- Oauth options -->
              <section id="firebaseui-auth-container">

              </section>
              <div class="authLinks d-flex align-center justify-space-around">
                <router-link
                  class="nuxtLink"
                  to="/register"
                >
                  Register
                </router-link>
                <router-link
                  class="nuxtLink"
                  to="/"
                >
                  Forgot password
                </router-link>
              </div>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebaseui'
import 'firebaseui/dist/firebaseui.css'
export default {
  data () {
    return {
      isValid: false,
      loading: true,
      form: {
        email: '',
        password: ''
      },
      isPassword: false,
      rules: {
        required: value => !!value || 'Required.',
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        password: v => !!v || 'Password is required'
      }
    }
  },
  methods: {
    submitForm () {
      this.loading = true
      if (!this.isValid) {
        alert('Form validation failed!')
        this.loading = false
        return
      }
      firebase
        .auth()
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          this.$router.replace({ name: 'Home' })
          this.loading = false
        })
        .catch(err => {
          console.error(err)
          alert(err)
          this.loading = false
        })
    }
  },
  mounted () {
    // eslint-disable-next-line no-undef
    var ui = firebaseui.auth.AuthUI.getInstance()
    if (!ui) {
      // eslint-disable-next-line no-undef
      ui = new firebaseui.auth.AuthUI(firebase.auth())
    }
    var uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
    }
    ui.start('#firebaseui-auth-container', uiConfig)
    this.loading = false
  }
}
</script>

<style>
</style>
