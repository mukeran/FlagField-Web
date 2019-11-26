<template>
  <section class="section">
    <div class="title-body">
      <p class="title">Submissions</p>
      <b-table
        :data="submissions"
        striped
        hoverable
        paginated
        pagination-position="bottom"
        :pagination-simple="true"
        :per-page="20"
        :current-page.sync="currentPage"
        :loading="isLoading">
        <template slot-scope="props">
          <b-table-column field="id" label="ID" width="80" numeric sortable>
            {{ props.row.id }}
          </b-table-column>
          <b-table-column field="problem_id" label="Problem ID" width="120" numeric sortable>
            {{ props.row.problem_id }}
          </b-table-column>
          <b-table-column field="user_id" label="User ID" width="120" numeric sortable>
            {{ props.row.user_id }}
          </b-table-column>
          <b-table-column field="flag" label="Flag">
            {{ props.row.flag }}
          </b-table-column>
          <b-table-column field="result" label="Result" width="40">
            <b-tag type="is-success" v-if="props.row.result ===1">Correct</b-tag>
            <b-tag type="is-danger" v-else>Wrong</b-tag>
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
              <p>No submission here.</p>
            </div>
          </section>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
import submission from '../../api/submission'

export default {
  name: 'Submission',
  data () {
    return {
      isLoading: false,
      submissions: [],
      currentPage: 1
    }
  },
  methods: {
    load () {
      this.isLoading = true
      submission.list()
        .then(({data}) => {
          this.submissions = data.submissions === null ? [] : data.submissions
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Unable to fetch submission list. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoading = false
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
.title {
  font-family: Lato, sans-serif;
  font-weight: normal;
}
.title-body {
  margin-bottom: 30px;
}
</style>
