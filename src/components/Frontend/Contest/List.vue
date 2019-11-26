<template>
  <section class="section">
    <b-table
      :data="contests"
      ref="table"
      paginated
      per-page="10"
      striped
      hoverable
      @click="enterContest"
      :row-class="() => 'contest-list-row'"
      :loading="isLoading"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page">
      <template slot-scope="props">
        <b-table-column field="id" label="ID" width="40" numeric sortable>
          {{ props.row.id }}
        </b-table-column>
        <b-table-column field="name" label="Name" sortable>
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="start_time" label="Start Time" sortable>
          {{ (new Date(props.row.start_time)).toLocaleString() }}
        </b-table-column>
        <b-table-column field="end_time" label="End Time" sortable>
          {{ (new Date(props.row.end_time)).toLocaleString() }}
        </b-table-column>
        <b-table-column field="access" label="Access">
          <span v-if="props.row.access === $const.contest_access.REGISTER">Register</span>
          <span v-else>Private</span>
        </b-table-column>
        <b-table-column label="Status">
          <b-tag type="is-info" v-if="status(props) === 0">Pending</b-tag>
          <b-tag type="is-danger" v-else-if="status(props) === 1">Running</b-tag>
          <b-tag type="is-success" v-else>Ended</b-tag>
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
            <p>No contest founded.</p>
          </div>
        </section>
      </template>
    </b-table>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ContestList',
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    status (props) {
      let currentTime = new Date()
      let startTime = new Date(props.row.start_time)
      let endTime = new Date(props.row.end_time)
      if (currentTime < startTime) {
        return 0
      } else if (startTime <= currentTime && currentTime < endTime) {
        return 1
      } else {
        return 2
      }
    },
    enterContest (row) {
      this.$router.push({ name: 'contestView', params: { contestID: row.id } })
    }
  },
  computed: {
    ...mapState({
      contests: state => state.contest.list
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.isLoading = true
      vm.$store.dispatch('contest/loadList')
        .catch((err) => {
          vm.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          vm.isLoading = false
        })
    })
  }
}
</script>

<style>
.contest-list-row:hover {
  cursor: pointer;
}
</style>
