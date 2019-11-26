<template>
  <section class="section">
    <div class="title-body">
      <p class="title">Settings</p>
      <div class="columns">
        <div class="column is-one-quarter">
          <b-menu>
            <b-menu-list label="Menu">
              <b-menu-item icon="information-variant" label="Profile" tag="router-link" :to="{ name: 'settingsProfile' }" :active="isProfile"></b-menu-item>
              <b-menu-item icon="security" label="Security" tag="router-link" :to="{ name: 'settingsSecurity' }" :active="isSecurity"></b-menu-item>
              <b-menu-item icon="settings" label="Preference" tag="router-link" :to="{ name: 'settingsPreference' }" :active="isPreference"></b-menu-item>
              <b-menu-item icon="alert" label="Danger Zone" tag="router-link" :to="{ name: 'settingsDangerZone' }" :active="isDangerZone"></b-menu-item>
            </b-menu-list>
            <b-menu-list v-if="isProfile" label="Action">
              <b-menu-item v-if="isProfile" icon="check-circle-outline" label="Submit" @click="submit" :disabled="isSubmitting"></b-menu-item>
            </b-menu-list>
          </b-menu>
        </div>
        <div class="column">
          <span v-if="isFrame">
            Please select one of the sections in the left menu.
          </span>
          <router-view
            ref="routerView"
            v-bind="routerProps"
            @on-is-submitting-changed="onIsSubmittingChanged"></router-view>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapIsRoute } from '../../../common'
import { mapState } from 'vuex'

export default {
  name: 'SettingsFrame',
  data () {
    return {
      isSubmitting: false
    }
  },
  computed: {
    ...mapIsRoute({
      isFrame: 'settings',
      isProfile: 'settingsProfile',
      isSecurity: 'settingsSecurity',
      isPreference: 'settingsPreference',
      isDangerZone: 'settingsDangerZone'
    }),
    ...mapState({
      session: state => state.session.logged
    }),
    routerProps () {
      if (this.isProfile) {
        return {
          isSubmitting: this.isSubmitting
        }
      }
    }
  },
  methods: {
    submit () {
      this.$refs.routerView.$emit('submit')
    },
    onIsSubmittingChanged (value) {
      this.isSubmitting = value
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // if (vm.session === null) {
      //   vm.$buefy.toast.open({
      //     message: 'Please log in first',
      //     type: 'is-danger'
      //   })
      //   vm.$router.push({ name: 'login', params: { path: vm.$route.path } })
      // }
      if (vm.isFrame) {
        vm.$router.push({ name: 'settingsProfile' })
      }
    })
  }
}
</script>

<style scoped>
.title {
  font-family: Lato, sans-serif;
}
</style>
