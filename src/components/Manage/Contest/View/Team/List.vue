<template>
  <div>
    <div class="level">
      <div class="level-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checkedTeams = []" :disabled="!checkedTeams.length || isUpdating">
            <b-icon icon="close"></b-icon>
            <span>Clear checked</span>
          </button>
          <button class="button field is-danger" @click="kickOffCheckedTeam" :disabled="!checkedTeams.length || isUpdating">
            <b-icon icon="delete-forever"></b-icon>
            <span>Kick off checked</span>
          </button>
        </b-field>
      </div>
      <div class="level-right">
        <b-field>
          <b-input
            placeholder="Search..."
            type="search"
            icon="magnify">
          </b-input>
          <p class="control">
            <button class="button is-primary">Search</button>
          </p>
        </b-field>
      </div>
    </div>
    <b-table
      :data="teams"
      striped
      hoverable
      checkable
      paginated
      pagination-position="bottom"
      :pagination-simple="true"
      :per-page="10"
      :current-page.sync="currentPage"
      :checked-rows.sync="checkedTeams"
      :loading="isLoading"
      :row-class="() => 'list-row'">
      <template slot-scope="props">
        <b-table-column field="id" label="ID" @click.native="enter(props.row.order)" sortable>
          {{ props.row.team_id }}
        </b-table-column>
        <b-table-column field="name" label="Name" @click.native="enter(props.row.order)" sortable>
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="members" label="Members" @click.native="enter(props.row.order)" sortable>
          <template v-for="(user, i) in props.row.members.slice(0, 5)">
            <img :src="`https://cn.gravatar.com/avatar/${user.email_hash}`" :alt="user.username" width="40" height="40" :title="user.username" :key="i">
          </template>
        </b-table-column>
        <b-table-column field="kickOff" label="Kick Off" width="40">
          <b-button type="is-danger" size="is-small" @click="kickOffTeam(props.row.order)" :disabled="props.row.is_updating">Delete</b-button>
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
            <p>No team here.</p>
          </div>
        </section>
      </template>
      <template slot="bottom-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checkedTeams = []" :disabled="!checkedTeams.length || isUpdating">
            <b-icon icon="close"></b-icon>
            <span>Clear checked</span>
          </button>
          <button class="button field is-danger" @click="kickOffCheckedTeam" :disabled="!checkedTeams.length || isUpdating">
            <b-icon icon="delete-forever"></b-icon>
            <span>Kick off checked</span>
          </button>
        </b-field>
      </template>
    </b-table>
    <b-modal
      :active.sync="_isAddTeamModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <add-team></add-team>
    </b-modal>
    <b-modal
      :active.sync="isViewTeamModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <view-team :team="clickedTeam"></view-team>
    </b-modal>
  </div>
</template>

<script>
import AddTeam from './Add'
import ViewTeam from './View'
import contest from '../../../../../api/contest'

export default {
  name: 'ContestTeam',
  components: { AddTeam, ViewTeam },
  props: {
    isAddTeamModalActive: Boolean
  },
  data () {
    return {
      isLoading: true,
      isUpdating: false,
      isViewTeamModalActive: false,
      teams: [],
      checkedTeams: [],
      currentPage: 1,
      clickedTeam: null
    }
  },
  computed: {
    _isAddTeamModalActive: {
      get () {
        return this.isAddTeamModalActive
      },
      set (value) {
        this.$emit('on-is-add-team-modal-active-changed', value)
      }
    }
  },
  methods: {
    load () {
      this.isLoading = true
      contest.getTeams(this.$route.params.contestID)
        .then(({data}) => {
          if (data.teams !== null) {
            for (let i = 0; i < data.teams.length; i++) {
              data.teams[i].is_updating = false
              data.teams[i].order = i
            }
            this.teams = data.teams
          } else {
            this.teams = []
          }
        })
        .catch(({response}) => {
          this.teams = []
          this.$buefy.toast.open({
            message: `Failed to fetch team list. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    enter (order) {
      this.clickedTeam = this.teams[order]
      this.isViewTeamModalActive = true
    },
    kickOffTeam (order) {
      this.teams[order].is_updating = true
      contest.batchDeleteTeams(this.$route.params.contestID, [this.teams[order].team_id])
        .then(({data}) => {
          if (data.details[0].status !== this.$const.status.SUCCESS) {
            this.$buefy.toast.open({
              message: `Failed to kick off team ${this.teams[order].team_id}. Message: ${data.details[0].message}`,
              type: 'is-danger'
            })
            this.teams[order].is_updating = false
          } else {
            this.$buefy.toast.open({
              message: `Successfully kicked off team ${this.teams[order].team_id}`,
              type: 'is-success'
            })
            this.load()
          }
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to kick off team ${this.teams[order].team_id}. Message: ${response.data.message}`,
            type: 'is-danger'
          })
          this.teams[order].is_updating = false
        })
    },
    kickOffCheckedTeam () {
      this.isUpdating = true
      let teamsID = []
      this.checkedTeams.forEach(value => {
        teamsID.push(value.team_id)
      })
      this.checkedTeams = []
      contest.batchDeleteTeams(this.$route.params.contestID, teamsID)
        .then(({data}) => {
          if (data.status === this.$const.status.PARTLY_FAILED) {
            this.$buefy.toast.open({
              message: 'Some team successfully kicked off, while the others is failed',
              type: 'is-warning'
            })
            console.log(data.details)
          } else {
            this.$buefy.toast.open({
              message: 'Successfully kicked off selected teams',
              type: 'is-success'
            })
          }
          this.load()
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: 'Failed to kicked of teams. Message: ' + response.data.message,
            type: 'is-danger'
          })
          console.log(response.data)
        })
        .finally(() => {
          this.isUpdating = false
        })
    }
  },
  watch: {
    isAddTeamModalActive (to, from) {
      if (to === false) {
        this.load()
      }
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
