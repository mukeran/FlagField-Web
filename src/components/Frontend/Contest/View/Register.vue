<template>
  <div class="modal-card register-modal" style="min-height: 500px">
    <b-loading :is-full-page="false" :active.sync="isRegistering"></b-loading>
    <header class="modal-card-head">
      <p class="modal-card-title">Register</p>
    </header>
    <section class="modal-card-body">
      <b-field label="Team" label-position="on-border">
        <b-autocomplete
          v-model="teamInput"
          :data="teams"
          placeholder="Please input your team name"
          field="name"
          size="is-medium"
          :loading="isFetchingTeams"
          :open-on-focus="true"
          :disabled="isRegistering"
          @typing="registerGetTeams"
          @focus="() => { registerGetTeams(teamInput) }"
          @select="option => { selectedTeam = option; selectedMembers.clear(); members = []; registerGetMembers(''); membersInput = [] }">
          <template slot-scope="props">
            <div class="media">
              <div class="media-left">
                {{ props.option.id }}
              </div>
              <div class="media-content">
                {{ props.option.name }}
              </div>
            </div>
          </template>
          <template slot="empty">
            Not found
          </template>
        </b-autocomplete>
      </b-field>
      <b-message type="is-info" v-if="selectedTeam !== null">
        Currently selected: {{ selectedTeam.name }}
      </b-message>
      <b-field label="Participants" label-position="on-border">
        <b-taginput
          v-model="membersInput"
          :data="members"
          autocomplete
          field="username"
          size="is-medium"
          :disabled="isRegistering"
          :loading="isFetchingMembers"
          :before-adding="registerCheckUser"
          @add="registerAddUser"
          @remove="registerRemoveUser"
          :open-on-focus="true"
          placeholder="Type username to select participants"
          @typing="registerGetMembers">
          <template slot-scope="props">
            <div class="media">
              <div class="media-left">
                <img :src="`https://cn.gravatar.com/avatar/${props.option.email_hash}`" height="40" width="40" :alt="`${props.option.username}'s avatar`">
              </div>
              <div class="media-content">
                {{ props.option.id }} | {{ props.option.username }}
              </div>
            </div>
          </template>
          <template slot="empty">
            Not found
          </template>
        </b-taginput>
      </b-field>
    </section>
    <footer class="modal-card-foot" style="justify-content: flex-end">
      <button class="button" type="button" @click="$parent.close()" :disabled="isRegistering">Close</button>
      <button class="button is-primary" @click="register" :disabled="isRegistering">Register</button>
    </footer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import debounce from 'debounce'
import contest from '../../../../api/contest'
import team from '../../../../api/team'
import user from '../../../../api/user'

export default {
  name: 'Register',
  data () {
    return {
      isRegistering: false,
      teamInput: '',
      teams: [],
      isFetchingTeams: false,
      selectedTeam: null,
      members: [],
      membersInput: [],
      isFetchingMembers: false,
      selectedMembers: new Set()
    }
  },
  computed: {
    ...mapState({
      session: state => state.session.logged
    })
  },
  methods: {
    register () {
      if (this.selectedTeam === null) {
        this.$buefy.toast.open({
          message: `Please choose a team`,
          type: 'is-danger'
        })
        return
      }
      if (this.selectedMembers.size === 0) {
        this.$buefy.toast.open({
          message: `Please choose at least a member`,
          type: 'is-danger'
        })
        return
      }
      this.isRegistering = true
      contest.addTeam(this.$route.params.contestID, this.selectedTeam.id, Array.from(this.selectedMembers))
        .then(() => {
          this.$buefy.toast.open({
            message: `Register successfully!`,
            type: 'is-success'
          })
          this.$parent.close()
        })
        .catch((err) => {
          if (typeof err.response.data.status !== 'undefined') {
            if (err.response.data.status === this.$const.status.CONTEST_STARTED) {
              this.$buefy.toast.open({
                message: `The contest has started, So you can't register now.`,
                type: 'is-danger'
              })
              this.$parent.close()
            } else if (err.response.data.status === this.$const.status.TEAM_PARTICIPATED) {
              this.$buefy.toast.open({
                message: `This team has participated in this contest.`,
                type: 'is-danger'
              })
            } else if (err.response.data.status === this.$const.status.MEMBER_PARTICIPATED) {
              this.$buefy.toast.open({
                message: `Some of the members you selected have participated in this contest`,
                type: 'is-danger'
              })
            } else {
              this.$buefy.toast.open({
                message: `Something wrong happened!`,
                type: 'is-danger'
              })
            }
          } else {
            this.$buefy.toast.open({
              message: `Connection error!`,
              type: 'is-danger'
            })
          }
        })
        .finally(() => {
          this.isRegistering = false
        })
    },
    registerCheckUser (user) {
      if (this.selectedMembers.has(user.id)) {
        this.$buefy.toast.open({
          message: 'You have selected this member!',
          type: 'is-danger'
        })
        return false
      }
      return true
    },
    registerAddUser (user) {
      this.selectedMembers.add(user.id)
    },
    registerRemoveUser (user) {
      this.selectedMembers.delete(user.id)
    },
    registerGetTeams: debounce(function (name) {
      this.isFetchingTeams = true
      user.getTeamByID(this.session.user_id, {
        admin: true,
        query: name
      })
        .then((res) => {
          if (res.data.teams === null) {
            this.teams = []
          } else {
            this.teams = res.data.teams
          }
        })
        .catch(() => {
          this.teams = []
          this.$buefy.toast.open({
            message: 'Error occurs when loading teams',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isFetchingTeams = false
        })
    }, 100),
    registerGetMembers: debounce(function (name) {
      if (this.selectedTeam === null) {
        this.members = []
        return
      }
      this.isFetchingMembers = true
      team.getMemberByID(this.selectedTeam.id, {
        query: name
      })
        .then((res) => {
          if (res.data.members === null) {
            this.members = []
          } else {
            this.members = res.data.members
          }
        })
        .catch(() => {
          this.members = []
          this.$buefy.toast.open({
            message: 'Error occurs when loading members',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isFetchingMembers = false
        })
    }, 100)
  }
}
</script>

<style scoped>

</style>
