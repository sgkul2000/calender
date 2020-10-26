<template>
  <div id="calenderMain">
    <div class="calendarTitle text-subtitle-1">
      Showing <span class="name mx-1">{{ user.data.displayName }}'s </span>Calendar
    </div>
    <v-sheet height="64">
      <v-toolbar flat>
        <v-btn
          outlined
          class="mr-4"
          color="grey darken-2"
          @click="setToday"
        >
          Today
        </v-btn>
        <v-btn
          class="mr-4"
          color="success"
          @click="dialog = true"
        >
          Create event <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="prev"
        >
          <v-icon small>
            mdi-chevron-left
          </v-icon>
        </v-btn>
        <v-btn
          fab
          text
          small
          color="grey darken-2"
          @click="next"
        >
          <v-icon small>
            mdi-chevron-right
          </v-icon>
        </v-btn>
        <v-toolbar-title v-if="$refs.calendar">
          {{ $refs.calendar.title }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-menu
          bottom
          right
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              outlined
              color="grey darken-2"
              v-bind="attrs"
              v-on="on"
            >
              <span>{{ typeToLabel[type] }}</span>
              <v-icon right>
                mdi-menu-down
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = '4day'">
              <v-list-item-title>4 days</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
    </v-sheet>
    <v-sheet height="600">
      <v-calendar
        ref="calendar"
        v-model="focus"
        color="primary"
        :events="events"
        :event-color="getEventsColor"
        :type="type"
        @click:event="showEvent"
        @click:more="viewDay"
        @click:date="viewDay"
        @change="updateRange"
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          color="grey lighten-4"
          min-width="350px"
          flat
        >
          <v-toolbar
            :color="selectedEvent.color"
            dark
          >
            <v-btn icon @click="deleteEvent(selectedEvent.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <form v-if="currentlyEditing !== selectedEvent.id">
                {{ selectedEvent.details }}
            </form>
            <form v-else>
                <textarea-autosize
                v-model="selectedEvent.details"
                type="test"
                style="width:100%"
                :min-height="100"
                placeholder="Add a note"
                >
                </textarea-autosize>
            </form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="secondary"
              @click="selectedOpen = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="editEvent(selectedEvent)"
              v-if="currentlyEditing !== selectedEvent.id"
            >
              Edit
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="updateEvent(selectedEvent)"
              v-else
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-container>
          <v-form  @submit.prevent="addEvent">
            <v-text-field v-model="name" type="text" label="Event Name"></v-text-field>
            <v-text-field v-model="details" type="text" label="Event Details"></v-text-field>
            <v-text-field v-model="start" type="date" label="Event Start Date"></v-text-field>
            <v-text-field v-model="end" type="date" label="Event End Date"></v-text-field>
            <v-text-field v-model="color" type="color" label="Event Color"></v-text-field>
            <v-btn type="submit" color="primary" class="mr-4" @click.stop="dialog = false">Create Event</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { db } from '@/main'
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    today: new Date().toISOString().substr(0, 10),
    focus: new Date().toISOString().substr(0, 10),
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days'
    },
    type: 'month',
    mode: 'stack',
    weekday: [0, 1, 2, 3, 4, 5, 6],
    value: '',
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    name: null,
    details: null,
    start: null,
    end: null,
    color: '#1976D2',
    currentlyEditing: null,
    selected: {},
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    dialog: false
  }),
  mounted () {
    this.getEvents()
  },
  methods: {
    editEvent (event) {
      this.currentlyEditing = event.id
    },
    async updateEvent (event) {
      await db.collection('calEvent').doc(this.currentlyEditing).update({ details: event.details })
      this.selectedOpen = false
      this.currentlyEditing = null
    },
    async deleteEvent (event) {
      await db.collection('calEvent').doc(event).delete()
      this.selectedOpen = false
      this.getEvents()
    },
    async addEvent () {
      if (this.name && this.start && this.end) {
        await db.collection('calEvent').add({
          userId: this.user.data.id,
          name: this.name,
          details: this.details,
          start: this.start,
          end: this.end,
          color: this.color
        })
        this.getEvents()
        this.name = ''
        this.details = ''
        this.start = ''
        this.end = ''
        this.color = '#197642'
      } else {
        alert('form validation failed')
      }
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        setTimeout(() => {
          this.selectedOpen = true
        }, 10)
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        setTimeout(open, 10)
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      this.start = start
      this.end = end
    },
    async getEvents () {
      this.events = []
      const snapshot = await db.collection('calEvent').where('userId', '==', this.user.data.id.toString()).get()
      snapshot.forEach((doc) => {
        const appData = doc.data()
        appData.id = doc.id
        this.events.push(appData)
      })
    },
    getEventsColor (event) {
      return event.color
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    }
  },
  computed: {
    ...mapGetters({
      user: 'user'
    })
  }
}
</script>

<style scoped src="@/assets/calender.scss" lang="scss" />
