<template>
<div>
  <div class="level">
    <div class="level-left">
      <b-field grouped group-multiline>
        <button class="button field" @click="invitationsSelected = []" :disabled="!invitationsSelected.length">Uncheck</button>
        <button class="button field is-primary" :disabled="!invitationsSelected.length" @click="acceptSelectedInvitations">Accept</button>
        <button class="button field is-danger" :disabled="!invitationsSelected.length" @click="rejectSelectedInvitations">Reject</button>
      </b-field>
    </div>
  </div>
  <b-table
    :data="invitations === null? []: invitations"
    :checked-rows.sync="invitationsSelected"
    :loading="isLoading"
    checkable
    checkbox-position="right">
    <template slot-scope="props">
      <b-table-column field="team_id" label="Team ID" sortable>
        {{ props.row.team_id }}
      </b-table-column>
      <b-table-column field="time" label="Time" sortable>
        {{ (new Date(props.row.time)).toLocaleString() }}
      </b-table-column>
      <b-table-column label="Status">
        <b-tag type="is-info" v-if="props.row.status === constants.invite_status.PENDING">Pending</b-tag>
        <b-tag type="is-success" v-else-if="props.row.status === constants.invite_status.ACCEPTED">Accepted</b-tag>
        <b-tag type="is-danger" v-else-if="props.row.status === constants.invite_status.REJECTED">Rejected</b-tag>
        <b-tag type="is-warning" v-else-if="props.row.status === constants.invite_status.FAILED">Failed</b-tag>
      </b-table-column>
    </template>
    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large">
            </b-icon>
          </p>
          <p>Nothing here.</p>
        </div>
      </section>
    </template>
    <template slot="bottom-left">
      <b-field grouped group-multiline>
        <button class="button field" @click="invitationsSelected = []" :disabled="!invitationsSelected.length">Uncheck</button>
        <button class="button field is-primary" :disabled="!invitationsSelected.length" @click="acceptSelectedInvitations">Accept</button>
        <button class="button field is-danger" :disabled="!invitationsSelected.length" @click="rejectSelectedInvitations">Reject</button>
      </b-field>
    </template>
  </b-table>
</div>
</template>

<script>
import { mapState } from 'vuex'
import team from '../../../api/team'
import constants from '../../../constants'
export default {
  name: 'Invitation',
  data () {
    return {
      isLoading: false,
      invitationsSelected: [],
      constants: constants
    }
  },
  computed: {
    ...mapState({
      invitations: state => state.team.invitations
    })
  },
  methods: {
    load () {
      this.isLoading = true
      this.$store.dispatch('team/loadInvitations')
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    acceptSelectedInvitations () {
      this.invitationsSelected.forEach((val, key) => {
        team.acceptInvitationByID(val.team_id).then((res) => {
          this.$buefy.toast.open({
            message: 'Accepted Successfully',
            type: 'is-success'
          })
          this.$store.dispatch('team/loadInvitations')
        }).catch((err) => {
          if (typeof err.response.data.status !== 'undefined') {
            switch (err.response.data.status) {
              case constants.status.ALREADY_JOINED_IN_TEAM:
                this.$buefy.toast.open({
                  message: `User already in team !`,
                  type: 'is-danger'
                })
                break
              default:
                this.$buefy.toast.open({
                  message: `Something wrong !`,
                  type: 'is-danger'
                })
            }
          } else {
            this.$store.dispatch('session/informConnectionError', err)
          }
        })
      })
    },
    rejectSelectedInvitations () {
      this.invitationsSelected.forEach((val, key) => {
        team.rejectInvitationByID(val.team_id).then((res) => {
          this.$buefy.toast.open({
            message: 'Rejected Successfully',
            type: 'is-success'
          })
          this.$store.dispatch('team/loadInvitations')
        }).catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.load()
    })
  }
}
</script>

<style scoped>

</style>
