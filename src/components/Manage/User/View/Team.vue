<template>
  <div>
    <b-table
      :data="teams"
      striped
      hoverable
      paginated
      pagination-position="bottom"
      :pagination-simple="true"
      :per-page="10"
      :current-page.sync="currentPage"
      :loading="isLoading"
      :row-class="() => 'list-row'"
      @click="enter">
      <template slot-scope="props">
        <b-table-column field="team_id" label="ID" width="40" numeric>
          {{ props.row.id }}
        </b-table-column>
        <b-table-column field="name" label="Name">
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="is_admin" label="Admin">
          {{ props.row.is_admin }}
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
            <p>The user hasn't joined any team.</p>
          </div>
        </section>
      </template>
    </b-table>
  </div>
</template>

<script>
import user from '../../../../api/user'

export default {
  name: 'Team',
  data () {
    return {
      isLoading: true,
      teams: [],
      currentPage: 1
    }
  },
  methods: {
    load () {
      this.isLoading = true
      user.getTeamByID(this.$route.params.userID)
        .then(({data}) => {
          this.teams = data.teams === null ? [] : data.teams
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Unable to fetch team list. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    enter (row) {
      // this.$router.push({ name: 'manageTeamView', params: { teamID: row.team_id } })
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
