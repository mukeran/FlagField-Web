<template>
  <div>
    <b-field>
      <p class="control">
        <b-button type="is-static">Token</b-button>
      </p>
      <b-input readonly id="token" v-model="token" placeholder="loading..." expanded></b-input>
      <p class="control">
        <b-button type="is-primary" @click="refreshToken">Refresh</b-button>
      </p>
      <p class="control">
        <b-button type="is-info" @click="copy2">Copy</b-button>
      </p>
    </b-field>
    <new-invitation-modal :is-modal-active.sync="_isInvitationModalActive" @updated="load" :team-i-d="teamID"/>
    <br>
    <div class="level">
      <div class="level-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checked = []" :disabled="!checked.length">Uncheck</button>
          <button class="button field is-warning" :disabled="!checked.length" @click="cancelChecked">Cancel</button>
        </b-field>
      </div>
    </div>
    <b-table
      :data="invitations === null ? [] : invitations"
      :checked-rows.sync="checked"
      :loading="isLoadingInv"
      pagination-simple
      paginated
      per-page=5
      current-page.sync=1
      pagination-position="bottom"
      checkable>
      <template slot-scope="props">
        <b-table-column field="from_user" label="From User" sortable>
          {{ props.row.from_user }}
        </b-table-column>
        <b-table-column field="to_user" label="To User" sortable>
          {{ props.row.to_user }}
        </b-table-column>
        <b-table-column field="invite_time" label="Invite Time" sortable>
          {{ (new Date(props.row.invite_time)).toLocaleString() }}
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
          <button class="button field" @click="checked = []" :disabled="!checked.length">Uncheck</button>
          <button class="button field is-warning" :disabled="!checked.length" @click="cancelChecked">Cancel</button>
        </b-field>
      </template>
    </b-table>
  </div>
</template>

<script>
import team from '../../../../../api/team'
import NewInvitationModal from './NewInvitation'
import constants from '../../../../../constants'
export default {
  name: 'ManageTeamInvitation',
  components: { NewInvitationModal },
  props: {
    teamID: Number,
    isInvitationModalActive: Boolean
  },
  data () {
    return {
      token: 'loading...',
      isLoadingInv: false,
      invitations: [],
      checked: [],
      constants: constants
    }
  },
  computed: {
    _isInvitationModalActive: {
      get () {
        return this.isInvitationModalActive
      },
      set (value) {
        this.$emit('update:isInvitationModalActive', value)
      }
    }
  },
  methods: {
    clear () {
      this.invitations = []
      this.checked = []
    },
    load () {
      this.loadToken()
      this.clear()
      this.isLoadingInv = true
      team.getInvitationByID(this.teamID).then((res) => {
        this.invitations = res.data.invitations
        if (this.invitations === null) {
          this.invitations = []
        }
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      }).finally(() => {
        this.isLoadingInv = false
      })
    },
    loadToken () {
      this.token = 'loading...'
      team.getTokenByID(this.teamID).then((res) => {
        this.token = res.data.token
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      })
    },
    refreshToken () {
      team.deleteTokenByID(this.teamID).then((res) => {
        this.$buefy.toast.open({
          message: 'Refreshed successfully',
          type: 'is-success'
        })
        this.loadToken()
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      })
    },
    cancelChecked () {
      this.checked.forEach((val, key) => {
        team.cancelInvitationByID(this.teamID, {user_id: val.to_user}).then((res) => {
          this.$buefy.toast.open({
            message: 'Canceled successfully',
            type: 'is-success'
          })
          this.load()
        }).catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
      })
    },
    doInvitation (userID) {
      team.sendInvitationByID(this.teamID, {user_id: userID}).then((res) => {
        this.$buefy.toast.open({
          message: res.data.message,
          type: 'is-success'
        })
        this.load()
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      })
    },
    copy2 () {
      var Url2 = document.getElementById('token').value
      // console.log(Url2)
      var oInput = document.createElement('input')
      oInput.value = Url2
      document.body.appendChild(oInput)
      oInput.select() // select
      document.execCommand('Copy') // copy
      oInput.className = 'oInput'
      oInput.style.display = 'none'
      this.$buefy.toast.open({
        message: 'Token Copied',
        type: 'is-info'
      })
    },
    copy () {
      let inp = document.getElementById('token')
      inp.select()
      document.execCommand('Copy')
      this.$buefy.toast.open({
        message: 'Token Copied',
        type: 'is-info'
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
