<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Add A Team</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <b-field label="Team" label-position="on-border">
        <b-autocomplete
          v-model="teamRaw"
          :data="teams"
          placeholder="Please input your team name"
          field="name"
          size="is-medium"
          :loading="isFetchingTeams"
          :open-on-focus="true"
          :disabled="isAdding"
          @typing="getTeams"
          @focus="() => { getTeams(teamRaw) }"
          @select="initMember">
          <template slot-scope="props">
            <div class="media">
              <div class="media-left">
                {{ props.option.team_id }}
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
          v-model="selectedMembersRaw"
          :data="members"
          autocomplete
          field="username"
          size="is-medium"
          :disabled="isAdding"
          :loading="isFetchingMembers"
          :before-adding="checkUser"
          @add="addUser"
          @remove="removeUser"
          :open-on-focus="true"
          placeholder="Type username to select participants"
          @typing="getMembers">
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
      <button class="button" type="button" @click="$parent.close()" :disabled="isAdding">Close</button>
      <button class="button is-primary" @click="add" :disabled="isAdding">Add</button>
    </footer>
  </div>
</template>

<script>
import debounce from 'debounce'
import team from '../../../../../api/team'
import contest from '../../../../../api/contest'

export default {
  name: 'TeamAdd',
  data () {
    return {
      isAdding: false,
      isFetchingTeams: false,
      isFetchingMembers: false,
      teams: [],
      teamRaw: '',
      selectedTeam: null,
      members: [],
      selectedMembersRaw: [],
      selectedMembers: new Set()
    }
  },
  methods: {
    initMember (option) {
      this.selectedTeam = option
      this.selectedMembers.clear()
      this.members = []
      this.getMembers('')
      this.selectedMembersRaw = []
    },
    checkUser (user) {
      if (this.selectedMembers.has(user.id)) {
        this.$buefy.toast.open({
          message: 'You have selected this member!',
          type: 'is-danger'
        })
        return false
      }
      return true
    },
    addUser (user) {
      this.selectedMembers.add(user.id)
    },
    removeUser (user) {
      this.selectedMembers.delete(user.id)
    },
    getTeams: debounce(function (name) {
      this.isFetchingTeams = true
      team.list({
        query: name
      })
        .then(({data}) => {
          this.teams = data.teams === null ? [] : data.teams
        })
        .catch(({response}) => {
          this.teams = []
          this.$buefy.toast.open({
            message: `Failed to fetch team list. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isFetchingTeams = false
        })
    }, 100),
    getMembers: debounce(function (name) {
      if (this.selectedTeam === null) {
        this.members = []
        return
      }
      this.isFetchingMembers = true
      team.getMemberByID(this.selectedTeam.team_id, {
        query: name
      })
        .then(({data}) => {
          this.members = data.members === null ? [] : data.members
        })
        .catch(({response}) => {
          this.members = []
          this.$buefy.toast.open({
            message: `Failed to fetch member list. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isFetchingMembers = false
        })
    }, 100),
    add () {
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
      this.isAdding = true
      contest.addTeam(this.$route.params.contestID, this.selectedTeam.team_id, Array.from(this.selectedMembers))
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully added team ${this.selectedTeam.name}`,
            type: 'is-success'
          })
          this.$parent.close()
        })
        .catch(({response}) => {
          if (response.data.status === this.$const.status.TEAM_PARTICIPATED) {
            this.$buefy.toast.open({
              message: `Team ${this.selectedTeam.name} has participated in this contest.`,
              type: 'is-danger'
            })
          } else if (response.data.status === this.$const.status.MEMBER_PARTICIPATED) {
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
        })
        .finally(() => {
          this.isAdding = false
        })
    }
  }
}
</script>

<style scoped>
.modal-card {
  min-height: 500px;
}
</style>
