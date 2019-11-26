<template>
  <section class="section">
    <div class="title-body">
      <new-team-modal :is-modal-active.sync="isModalActive" :admin="true"><span class="title">Teams </span></new-team-modal>
    </div>
    <div class="level">
      <div class="level-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checkedTeams = []" :disabled="!checkedTeams.length">
            <b-icon icon="close"></b-icon>
            <span>Clear checked</span>
          </button>
          <button class="button field is-danger" @click="deleteCheckedTeams" :disabled="!checkedTeams.length">
            <b-icon icon="delete-forever"></b-icon>
            <span>Delete checked</span>
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
      :data="teamList !== null ? teamList : []"
      :loading="isLoading"
      checkable
      :checked-rows.sync="checkedTeams"
      hoverable
      striped
      :row-class="() => 'list-row'"
      @click="enter"
      paginated
      per-page=15
      current-page.sync=1
      pagination-position="bottom"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page">

      <template slot-scope="props">
        <b-table-column field="team_id" label="ID" width="40" sortable numeric>
          {{ props.row.team_id }}
        </b-table-column>

        <b-table-column field="name" label="Team Name" sortable>
          {{ props.row.name }}
        </b-table-column>

        <b-table-column field="member_count" label="Member Count" sortable numeric>
          {{ props.row.member_count }}
        </b-table-column>

        <b-table-column field="date" label="Create Date" sortable centered>
          {{ new Date(props.row.create_at).toLocaleDateString() }}
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
          <button class="button field" @click="checkedTeams = []" :disabled="!checkedTeams.length">
            <b-icon icon="close"></b-icon>
            <span>Clear checked</span>
          </button>
          <button class="button field is-danger" @click="deleteCheckedTeams" :disabled="!checkedTeams.length">
            <b-icon icon="delete-forever"></b-icon>
            <span>Delete checked</span>
          </button>
        </b-field>
      </template>
    </b-table>
  </section>
</template>

<script>
import team from '../../../api/team'
import NewTeamModal from './New'
export default {
  name: 'TeamManageList',
  components: {NewTeamModal},
  data () {
    return {
      isLoading: false,
      isModalActive: false,
      teamList: [],
      checkedTeams: []
    }
  },
  methods: {
    loadList () {
      this.isLoading = true
      team.all().then((res) => {
        this.teamList = res.data.teams
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      }).finally(() => {
        this.isLoading = false
      })
    },
    deleteCheckedTeams () {
      this.checkedTeams.forEach((val, key) => {
        team.deleteByID(val.team_id)
          .catch((err) => {
            this.$store.dispatch('session/informConnectionError', err)
          })
      })
      this.loadList()
    },
    enter (row) {
      this.$router.push({ name: 'manageTeamView', params: { teamID: row.team_id } })
    }
  },
  beforeRouteEnter (from, to, next) {
    next(vm => {
      vm.loadList()
    })
  }
}
</script>

<style>
  .title {
    font-family: Lato, sans-serif;
    font-weight: normal;
  }
  .title-body {
    margin-bottom: 30px;
  }
  .list-row:hover {
    cursor: pointer;
  }
</style>
