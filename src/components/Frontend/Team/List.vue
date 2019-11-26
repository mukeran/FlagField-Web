<template>
<div>
  <b-table
    :data="allTeams"
    :loading="isLoading"
    paginated
    per-page=15
    current-page.sync=1
    pagination-position="bottom"
    default-sort-direction="asc"
    sort-icon="arrow-up"
    sort-icon-size="is-small"
    default-sort="team_id"
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
      <b-table-column field="team_id" label="Detail">
        <b-button type="is-link" @click="$router.push({ name: 'teamView', params: { teamID: props.row.team_id }})">Detail</b-button>
      </b-table-column>
      <b-table-column field="team_id" label="Apply">
        <b-button type="is-info" @click="apply(props.row)">Apply</b-button>
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
  </b-table>
</div>
</template>

<script>
import team from '../../../api/team'
import { mapState } from 'vuex'
export default {
  name: 'TeamList',
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      allTeams: state => state.team.allTeams
    })
  },
  methods: {
    load () {
      this.isLoading = true
      this.$store.dispatch('team/loadTeams')
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    apply (row) {
      team.sendApplicationByID(row.team_id).then((res) => {
        this.$buefy.toast.open({
          message: 'Sended successfully',
          type: 'is-success'
        })
        this.$store.dispatch('team/loadApplications')
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      })
    }
  },
  watch: {
    '$route' (from, to) {
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
