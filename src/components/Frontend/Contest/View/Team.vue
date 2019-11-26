<template>
  <div style="position: relative">
    <template v-if="isNotParticipated">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large">
            </b-icon>
          </p>
          <p>You haven't participated in this contest.</p>
          <b-button
            v-if="contestStatus !== 2"
            @click="isRegisterModalActive = true"
            size="is-large"
            type="is-primary"
            icon-left="account-plus">
            Register Now
          </b-button>
        </div>
      </section>
    </template>
    <template v-else>
      <div class="team-section">
        <p class="team-section-title">Members</p>
        <hr class="team-section-separator">
        <div class="team-section-content">
          <template v-if="isCurrentTeamLoading || team === null">Loading... <b-icon icon="loading" custom-class="mdi-spin"></b-icon></template>
          <template v-else>
            <template v-for="(user, i) in team.members">
              <div class="card team-member-card has-text-centered" @click="$router.push({ name: 'userProfile', params: { userID: user.id } })" :key="i">
                <div class="card-image">
                  <figure class="image is-1by1">
                    <img :src="`https://cn.gravatar.com/avatar/${user.email_hash}`" height="80" width="80" :alt="`${user.username}'s avatar`">
                  </figure>
                </div>
                <div class="team-member-content">
                  <span class="team-member-name">{{ user.username }}</span>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
      <div class="team-section">
        <p class="team-section-title">Submissions</p>
        <hr class="team-section-separator">
        <div class="team-section-content">
          <template v-if="isCurrentTeamLoading || team === null">Loading... <b-icon icon="loading" custom-class="mdi-spin"></b-icon></template>
          <template v-else>
            <b-table
              :data="submissions"
              paginated
              per-page="10"
              striped
              hoverable
              :loading="isCurrentTeamLoading"
              :show-detail-icon="true"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page">
              <template slot-scope="props">
                <b-table-column field="problemAlias" label="Problem Alias">
                  {{ props.row.problem_alias }}
                </b-table-column>
                <b-table-column field="username" label="Username" sortable>
                  {{ userMapping.get(props.row.user_id) }}
                </b-table-column>
                <b-table-column field="solvedTime" label="Solved Time" sortable>
                  {{ (new Date(props.row.solved_time)).toLocaleString() }}
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
                    <p>No correct submissions founded.</p>
                  </div>
                </section>
              </template>
            </b-table>
          </template>
        </div>
      </div>
    </template>
    <b-loading :is-full-page="false" :active.sync="isCurrentTeamLoading"></b-loading>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFlag } from '../../../../common'

export default {
  name: 'Team',
  data () {
    return {
      userMapping: new Map()
    }
  },
  computed: {
    ...mapState({
      contest: state => state.contest.active,
      team: state => state.contest.currentTeam,
      submissions: state => state.contest.currentTeamSubmissions,
      isNotParticipated: state => state.contest.isNotParticipated,
      contestStatus: state => state.contest.activeStatus
    }),
    ...mapFlag({
      isCurrentTeamLoading: { state: state => state.contest.isCurrentTeamLoading, mutation: 'contest/setIsCurrentTeamLoading' },
      isRegisterModalActive: { state: state => state.contest.isRegisterModalActive, mutation: 'contest/setIsRegisterModalActive' }
    })
  },
  methods: {
    makeUserMapping () {
      if (this.team !== null) {
        this.userMapping = new Map()
        this.team.members.forEach(user => {
          this.userMapping.set(user.id, user.username)
        })
      }
    },
    load () {
      if (!this.isCurrentTeamLoading) {
        this.isCurrentTeamLoading = true
        this.loadCurrentTeam({ contestID: this.$route.params.contestID })
          .finally(() => {
            this.isCurrentTeamLoading = false
          })
      }
    },
    ...mapActions({
      loadCurrentTeam: 'contest/loadCurrentTeam'
    })
  },
  watch: {
    isCurrentTeamLoading (to, from) {
      if (to === false) {
        this.makeUserMapping()
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
.team-section>.team-section-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
.team-section>.team-section-separator {
  margin-top: 0;
}
.team-member-card {
  width: 80px;
  min-height: 100px;
  display: inline-block;
  margin: 0 1rem 0.8rem;
  vertical-align: top;
  border: 0;
}
.team-member-card:hover {
  cursor: pointer;
}
.team-member-card>.team-member-content {
  word-wrap: break-word;
  word-break: break-all;
  line-height: 1.2rem;
}
</style>
