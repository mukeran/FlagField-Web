<template>
  <section class="section">
    <div class="title-body">
      <p class="title">Team</p>
    </div>
    <br>
    <div class="columns">
      <div class="column is-one-quarter">
        <b-menu>
          <b-menu-list label="MENU">
            <b-menu-item icon="information-variant" label="My Team" tag="router-link" :to="routeRelative('my')" :active="isMy"></b-menu-item>
            <b-menu-item icon="account" label="List" tag="router-link" :to="routeRelative('list')" :active="isList"></b-menu-item>
            <b-menu-item icon="account-circle" label="Invitation" tag="router-link" :to="routeRelative('invitation')" :active="isInvitation"></b-menu-item>
            <b-menu-item icon="account-badge" label="Application" tag="router-link" :to="routeRelative('application')" :active="isApplication"></b-menu-item>
          </b-menu-list>
          <b-menu-list label="Actions" v-if="(isMy || isApplication)">
            <b-menu-item v-show="isMy" icon="plus" label="Create a Team" @click="isNewTeam = true" :disabled="isLoading"></b-menu-item>
            <b-menu-item v-show="isApplication" icon="plus" label="New Application" @click="isApp = true" :disabled="isLoading"></b-menu-item>
            <b-menu-item v-show="isApplication" icon="plus" label="Token" @click="isToken = true" :disabled="isLoading"></b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
      <div class="column">
        <router-view/>
      </div>
    </div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    <new-team-modal :is-modal-active.sync="isNewTeam" :show-button="false"/>
  </section>
</template>

<script>
import { mapIsRoute } from '../../../common'
import NewTeamModal from '../../Manage/Team/New'
export default {
  name: 'Frame',
  components: {NewTeamModal},
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapIsRoute({
      isMy: 'myTeam',
      isList: 'teamList',
      isInvitation: 'myInvitation',
      isApplication: 'myApplication'
    }),
    isNewTeam: {
      get () {
        return this.$store.state.team.isNewTeamModalActive
      },
      set (value) {
        this.$store.commit('team/setIsNewTeamModalActive', value)
      }
    },
    isToken: {
      get () {
        return this.$store.state.team.isTokenModalActive
      },
      set (value) {
        this.$store.commit('team/setIsTokenModalActive', value)
      }
    },
    isApp: {
      get () {
        return this.$store.state.team.isApplicationModalActive
      },
      set (value) {
        this.$store.commit('team/setIsApplicationModalActive', value)
      }
    }
  },
  methods: {
    routeRelative (name) {
      let m = new Map([
        ['..', { name: '' }],
        ['.', { name: 'team' }],
        ['my', { name: 'myTeam' }],
        ['list', { name: 'teamList' }],
        ['application', { name: 'myApplication' }],
        ['invitation', { name: 'myInvitation' }]
      ])
      return m.get(name)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
    })
  }
}
</script>

<style scoped>

</style>
