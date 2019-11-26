<template>
  <b-navbar id="navBar">
    <template slot="brand">
      <b-navbar-item tag="router-link" :to="{ name: 'manageIndex' }" id="navBar-logo">
        <b-icon
          icon="flag"
          size="is-small"
        ></b-icon>&nbsp;
        FlagField&nbsp;<i>Manage</i>
      </b-navbar-item>
    </template>
    <template slot="start">
      <b-navbar-dropdown label="Contests">
        <b-navbar-item tag="router-link" :to="{ name: 'manageContestView', params: { contestID: '__practice__' } }">
          Practice
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'manageContestList' }">
          All Contests
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'manageSubmission' }">
          Submissions
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown label="Teams&Users">
        <b-navbar-item tag="router-link" :to="{ name: 'manageTeam' }">
          Teams
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ name: 'manageUserList' }">
          Users
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-item tag="router-link" :to="{ name: 'manageNotification' }">
        Notifications
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ name: 'manageResource' }">
        Resources
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ name: 'manageConfig' }">
        Configures
      </b-navbar-item>
    </template>
    <template slot="end">
      <template v-if="!isLoggedIn">
        <b-navbar-item tag="div" key="login">
          <b-button type="is-primary" tag="router-link" :to="{ name: 'login', query: { path: $route.fullPath } }">
            <strong>Sign up / Log in</strong>
          </b-button>
        </b-navbar-item>
      </template>
      <template v-else>
        <b-navbar-item tag="router-link" :to="{ name: 'index' }">
          Frontend
        </b-navbar-item>
        <b-navbar-dropdown :label="shortUsername" key="user">
          <b-navbar-item tag="a" @click.native="logout()">
            Logout
          </b-navbar-item>
        </b-navbar-dropdown>
      </template>
    </template>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Header',
  data () {
    return {
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('session/logout')
        .then((res) => {
          this.$router.go(0)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: state => state.session.isLoggedIn,
      loggedSession: state => state.session.logged
    }),
    shortUsername () {
      if (this.loggedSession.username.length <= 8) {
        return this.loggedSession.username
      }
      return this.loggedSession.username.substr(0, 8) + '...'
    }
  }
}
</script>

<style scoped>
  #navBar {
    /*border-bottom: 1px rgba(255,255,255,0.96);*/
  }
  #navBar-logo {
    font-size: 20px;
  }
</style>
