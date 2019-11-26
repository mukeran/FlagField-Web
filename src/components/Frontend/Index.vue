<template>
  <section class="section">
    <div class="tile is-ancestor">
      <div class="tile is-vertical is-8">
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <article class="tile is-child notification is-primary">
              <p class="heading">Site established since</p>
              <p class="title">{{(new Date(setup_time)).toDateString()}}</p>
            </article>
            <article class="tile is-child notification is-light">
              <p class="heading">Total submissions</p>
              <p class="title">{{total_submissions}}</p>
            </article>
          </div>
          <div class="tile is-parent is-vertical">
            <article class="tile is-child notification is-info">
              <p class="heading">Registered users</p>
              <p class="title">{{registered_users}}</p>
            </article>
            <article class="tile is-child notification is-dark">
              <p class="heading">Hosted contests</p>
              <p class="title">{{hosted_contests}}</p>
            </article>
          </div>
        </div>
        <div class="tile is-parent">
          <article class="tile is-child box">
            <p class="heading">Notification</p>
            <div class="content">
              <p>
                {{notification}}
              </p>
            </div>
          </article>
        </div>
      </div>
      <div class="tile is-parent">
        <article class="tile is-child box">
          <p class="heading">Upcoming contests</p>
          <div class="content">
            <template v-if="true">
            <b-table
              :data="contests"
              :mobile-cards="false"
              striped
              paginated
              :pagination-simple="true"
              per-page="4"
              :loading="isLoadingContest">
              <template slot-scope="props">
                <template v-if="status(props) === 0 || status(props) === 1">
                  <b-table-column field="name" label="Name">
                    {{ props.row.name }}
                  </b-table-column>
                  <b-table-column field="start_time" label="Start Time">
                    {{ (new Date(props.row.start_time)).toLocaleString() }}
                  </b-table-column>
                </template>
              </template>
            </b-table>
            </template>
            <template v-else>
              <p>Please Login first</p>
            </template>
          </div>
        </article>
      </div>
    </div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import contest from '../../api/contest'
import statistic from '../../api/statistic'

export default {
  name: 'Index',
  data () {
    return {
      isLoading: false,
      isLoadingContest: false,
      setup_time: Date.UTC(2019, 9, 1, 0, 0, 0, 0),
      registered_users: 0,
      total_submissions: 0,
      hosted_contests: 0,
      notification: '',
      contests: []
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
    load () {
      this.isLoading = true
      statistic.getStatistic()
        .then(({data}) => {
          this.isLoading = false
          this.setup_time = data.setup_time
          this.registered_users = data.registered_users
          this.total_submissions = data.total_submissions
          this.hosted_contests = data.hosted_contests
          this.notification = data.notification
        })
        .catch(({message, response}) => { // in case no response
          this.$buefy.toast.open({
            message: `Failed to fetch statistics. Message: ${(response) ? response.data.message : message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
      this.loadContest()
    },
    loadContest () {
      this.isLoadingContest = true
      contest.list({
        status: 0
      })
        .then(({data}) => {
          this.contests = data.contests === null ? [] : data.contests
        })
        .catch(({message, response}) => {
          this.$buefy.toast.open({
            message: `Failed to fetch upcoming contests. Message: ${(response) ? response.data.message : message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoadingContest = false
        })
    }
  },
  beforeRouteEnter (from, to, next) {
    next(vm => {
      document.title = 'Index - FlagField'
      vm.load()
    })
  }
}
</script>

<style scoped>
.publish-time {
  text-align: right;
}
</style>
