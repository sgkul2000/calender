<template>
  <div class="about">
    <v-container>
      <v-row>
        <v-col class="mx-auto" cols="10" md="6"><v-img :width="'100%'" src="@/assets/calender.svg">
          </v-img></v-col>
        <v-col cols="10" md="6" class="mx-auto">
          <div class="wrapper px-4">

          <div class="text-overline my-3">
            Calender App
          </div>
          An app created with Vue, Vuetify and firebase. Highlighting features are the use firestore, firebase authentication and Google signin and signup.
          </div>
          <v-btn color="#ff8008" class="my-3 white--text">
            Head over to the app right now!
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
