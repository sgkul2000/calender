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
          <v-form v-model="isValid" class="py-4">
            <v-card-title>Register</v-card-title>
            <v-card-text>
              <v-text-field v-model="form.name" :rules="[rules.required]" label="Name" :disabled="loading" />
              <v-text-field v-model="form.email" :rules="[rules.required, rules.email]" label="E-mail" :disabled="loading" />
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
              <v-text-field
                v-model="passwordConfirm"
                :append-icon="isPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                :type="isPasswordConfirm ? 'text' : 'password'"
                :rules="[rules.required, rules.password]"
                label="Confirm Password"
                required
                :disabled="loading"
                @click:append="isPasswordConfirm = !isPasswordConfirm"
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
                Register
              </v-btn>
              <div style="text-align:center">or</div>
              <!-- Oauth options -->
              <section id="firebaseui-auth-container">

              </section>
              <div class="authLinks d-flex align-center justify-space-around">
                <router-link class="nuxtLink" to="/">
                  Login
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
        password: '',
        name: ''
      },
      passwordConfirm: '',
      isPassword: false,
      isPasswordConfirm: false,
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
        alert('form validation failed!')
        this.loading = false
        return
      }
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.form.email, this.form.password)
        .then(data => {
          data.user
            .updateProfile({
              displayName: this.form.name
            })
            .then(() => {
              this.loading = false
              this.$router.push({ name: 'Home' })
            })
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
