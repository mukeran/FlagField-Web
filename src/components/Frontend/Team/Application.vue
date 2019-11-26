<template>
<div>
  <div class="level">
    <div class="level-left">
      <b-field grouped group-multiline>
        <button class="button field" @click="applicationsSelected = []" :disabled="!applicationsSelected.length">Uncheck</button>
        <button class="button field is-warning" :disabled="!applicationsSelected.length" @click="cancelSelectedApplications">Cancel</button>
      </b-field>
    </div>
  </div>
  <b-table
    :data="applications === null? []: applications"
    :checked-rows.sync="applicationsSelected"
    :loading="isLoading"
    checkable>
    <template slot-scope="props">
      <b-table-column field="team_id" label="Team ID" sortable>
        {{ props.row.team_id }}
      </b-table-column>
      <b-table-column field="start_time" label="Apply Time" sortable>
        {{ (new Date(props.row.time)).toLocaleString() }}
      </b-table-column>
      <b-table-column label="Status">
        <b-tag type="is-info" v-if="props.row.status === 1">Pending</b-tag>
        <b-tag type="is-success" v-else-if="props.row.status === 2">Accepted</b-tag>
        <b-tag type="is-danger" v-else-if="props.row.status === 3">Rejected</b-tag>
        <b-tag type="is-warning" v-else-if="props.row.status === 4">Failed</b-tag>
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
        <button class="button field" @click="applicationsSelected = []" :disabled="!applicationsSelected.length">Uncheck</button>
        <button class="button field is-warning" :disabled="!applicationsSelected.length" @click="cancelSelectedApplications">Cancel</button>
      </b-field>
    </template>
  </b-table>
  <TokenModal :is-modal-active.sync="isToken"/>
  <new-application-modal :is-modal-active.sync="isApp"/>
</div>
</template>

<script>
import { mapState } from 'vuex'
import team from '../../../api/team'
import constants from '../../../constants'
import NewApplicationModal from './Components/NewApplication'
import TokenModal from './Components/JoinByToken'
export default {
  name: 'Application',
  components: {TokenModal, NewApplicationModal},
  data () {
    return {
      isLoading: false,
      applicationsSelected: [],
      constants: constants
    }
  },
  computed: {
    ...mapState({
      applications: state => state.team.applications
    }),
    isApp: {
      get () {
        return this.$store.state.team.isApplicationModalActive
      },
      set (value) {
        this.$store.commit('team/setIsApplicationModalActive', value)
      }
    },
    isToken: {
      get () {
        return this.$store.state.team.isTokenModalActive
      },
      set (value) {
        this.$store.commit('team/setIsTokenModalActive', value)
      }
    }
  },
  methods: {
    load () {
      this.$store.dispatch('team/loadApplications')
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    doApplication (teamID) {
      team.sendApplicationByID(teamID).then((res) => {
        this.$buefy.toast.open({
          message: 'sended successfully',
          type: 'is-success'
        })
        this.$store.dispatch('team/loadApplications')
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      })
    },
    cancelSelectedApplications () {
      this.applicationsSelected.forEach((val, key) => {
        team.cancelApplicationByID(val.team_id).then((res) => {
          this.$buefy.toast.open({
            message: 'Canceled Successfully',
            type: 'is-success'
          })
          this.$store.dispatch('team/loadApplications')
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
