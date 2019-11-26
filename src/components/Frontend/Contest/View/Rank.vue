<template>
  <div>
    <template v-if="contest !== null && contestStatus === 0">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large">
            </b-icon>
          </p>
          <p>The contest hasn't started yet.</p>
        </div>
      </section>
    </template>
    <template v-else>
      <div class="chart">
        <v-chart ref="chart" :options="options"/>
      </div>
      <template v-if="isLoading || teams === null">Loading... <b-icon icon="loading" custom-class="mdi-spin"></b-icon></template>
      <template v-else>
        <b-table
          :data="teams === null ? [] : teams"
          default-sort="points"
          default-sort-direction="desc"
          :loading="isLoading"
          striped>
          <template slot-scope="props">
            <b-table-column field="id" label="ID" width="40" sortable numeric>
              {{ props.row.id }}
            </b-table-column>
            <b-table-column field="name" label="Name" centered>
              {{ props.row.name }}
            </b-table-column>
            <b-table-column field="points" label="Points" sortable numeric centered>
              {{ props.row.points }}
            </b-table-column>
            <b-table-column field="solved_problems" label="Solved" sortable numeric centered>
              {{ props.row.solved_problems }}
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
      </template>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'contestRank',
  data () {
    return {
      isLoading: false
    }
  },
  methods: {
    loadView () {
      this.isLoading = true
      if (this.$refs.chart) {
        this.$refs.chart.showLoading()
      }
      let p1 = this.$store.dispatch('contest/load', { contestID: this.$route.params.contestID })
      let p2 = this.$store.dispatch('statistic/loadAll', { contestID: this.$route.params.contestID, isPractice: false })
      Promise.all([p1, p2])
        .finally(() => {
          this.isLoading = false
          this.$refs.chart.hideLoading()
        })
    }
  },
  computed: {
    ...mapState({
      teams: state => state.statistic.teams,
      submissions: state => state.statistic.submissions,
      options: state => state.statistic.chartOptions,
      contest: state => state.contest.active,
      contestStatus: state => state.contest.activeStatus
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadView()
    })
  }
}
</script>

<style scoped>
.echarts {
  width: 100%;
}
</style>
