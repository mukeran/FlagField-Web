<template>
  <section class="section">
    <div class="chart">
      <v-chart ref="chart" :options="options"/>
    </div>
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
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'rank',
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
      this.$store.dispatch('statistic/loadAll', {contestID: '__practice__', isPractice: true})
        .then((res) => {
          this.isLoading = false
          this.$refs.chart.hideLoading()
        })
        .catch((err) => {
          this.isLoading = false
          this.$refs.chart.hideLoading()
          this.$store.dispatch('session/informConnectionError', err)
        })
    }
  },
  computed: {
    ...mapState({
      teams: state => state.statistic.teams,
      submissions: state => state.statistic.submissions,
      options: state => state.statistic.chartOptions
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
    width: 95%;
  }
</style>
