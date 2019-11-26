<template>
  <div>
    <div class="level">
      <div class="level-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checked = []" :disabled="!checked.length">Uncheck</button>
          <button class="button field is-danger" :disabled="!checked.length" @click="acceptChecked">Accept</button>
          <button class="button field is-warning" :disabled="!checked.length" @click="rejectChecked">Reject</button>
        </b-field>
      </div>
    </div>
    <b-table
      :data="applications === null? []:applications"
      :checked-rows.sync="checked"
      :loading="isLoadingApp"
      pagination-simple
      paginated
      per-page=5
      current-page.sync=1
      pagination-position="bottom"
      checkable>
      <template slot-scope="props">
        <b-table-column field="user_id" label="User ID" sortable>
          {{ props.row.user_id }}
        </b-table-column>
        <b-table-column field="start_time" label="Apply Time" sortable>
          {{ (new Date(props.row.apply_time)).toLocaleString() }}
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
          <button class="button field is-danger" :disabled="!checked.length" @click="acceptChecked">Accept</button>
          <button class="button field is-warning" :disabled="!checked.length" @click="rejectChecked">Reject</button>
        </b-field>
      </template>
    </b-table>
  </div>
</template>

<script>
import team from '../../../../../api/team'
import constants from '../../../../../constants'
export default {
  name: 'ManageTeamAppliation',
  props: {
    teamID: Number
  },
  data () {
    return {
      token: 'loading...',
      isLoadingApp: false,
      applications: [],
      checked: [],
      constants: constants
    }
  },
  methods: {
    clear () {
      this.applications = []
      this.checked = []
    },
    load () {
      this.clear()
      this.isLoadingApp = true
      team.getApplicationByID(this.teamID).then((res) => {
        this.applications = res.data.applications
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      }).finally(() => {
        this.isLoadingApp = false
      })
    },
    acceptChecked () {
      this.checked.forEach((val, key) => {
        team.acceptApplicationByID(this.teamID, {user_id: val.user_id}).then((res) => {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-success'
          })
          this.load()
        }).catch((err) => {
          if (typeof err.response.data.status !== 'undefined') {
            if (err.response.data.status === constants.status.NO_SUCH_APPLICATION) {
              this.$buefy.toast.open({
                message: `No such application!`,
                type: 'is-danger'
              })
              return
            }
          }
          this.$store.dispatch('session/informConnectionError', err)
        })
      })
    },
    rejectChecked () {
      this.checked.forEach((val, key) => {
        team.rejectApplicationByID(this.teamID, {user_id: val.user_id}).then((res) => {
          this.$buefy.toast.open({
            message: res.data.message,
            type: 'is-success'
          })
          this.load()
        }).catch((err) => {
          if (typeof err.response.data.status !== 'undefined') {
            switch (err.response.data.status) {
              case constants.status.NO_SUCH_APPLICATION:
                this.$buefy.toast.open({
                  message: `No such application!`,
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
