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
    <template v-else-if="contest !== null && contestStatus === 0">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large">
            </b-icon>
          </p>
          <p>The contest hasn't start yet.</p>
        </div>
      </section>
    </template>
    <template v-else>
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle">
              <strong>{{ solvedProblems.size }}</strong>&nbsp;Solved
            </p>
          </div>
          <div class="level-item">
            <p class="subtitle">
              <strong>{{ problemCount }}</strong>&nbsp;Total
            </p>
          </div>
        </div>
      </div>
      <template v-if="problemCount === 0">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                icon="emoticon-sad"
                size="is-large">
              </b-icon>
            </p>
            <p>No problem founded.</p>
          </div>
        </section>
      </template>
      <template v-else>
        <template v-for="(row, i) in problemRows">
          <div class="tile is-ancestor" :key="i">
            <template v-for="(item, j) in row">
              <div class="tile is-3 is-parent" :key="j">
                <article :class="['title', 'is-child', 'notification', 'problem-info', solvedProblems.has(item.alias) ? 'is-light' : typeColor[item.type] ]" @click="$router.push({ name: 'contestViewProblemView', params: { problemAlias: item.alias } })">
                  <p class="heading">{{ item.type }}</p>
                  <p class="title">
                    {{ item.name }}
                    <b-icon v-show="solvedProblems.has(item.alias)" icon="check" size="is-medium" type="is-success"></b-icon>
                  </p>
                  <p class="subtitle">{{ item.points }} pts</p>
                </article>
              </div>
            </template>
          </div>
        </template>
      </template>
    </template>
    <b-loading :is-full-page="false" :active.sync="isProblemLoading"></b-loading>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mapFlag } from '../../../../../common'

export default {
  name: 'ContestProblem',
  data () {
    return {
      colorList: ['is-primary', 'is-success', 'is-danger', 'is-warning', 'is-info', 'is-dark'],
      typeColor: {}
    }
  },
  computed: {
    ...mapState({
      problems: state => state.contest.problems,
      problemCount: state => state.contest.problemCount,
      problemTypes: state => state.contest.problemTypes,
      solvedProblems: state => state.contest.solvedProblems,
      contest: state => state.contest.active,
      currentTeam: state => state.contest.currentTeam,
      currentTeamSubmissions: state => state.contest.currentTeamSubmissions,
      isNotParticipated: state => state.contest.isNotParticipated,
      contestStatus: state => state.contest.activeStatus
    }),
    ...mapFlag({
      isProblemLoading: { state: state => state.contest.isProblemLoading, mutation: 'contest/setIsProblemLoading' },
      isCurrentTeamLoading: { state: state => state.contest.isCurrentTeamLoading, mutation: 'contest/setIsCurrentTeamLoading' },
      isRegisterModalActive: { state: state => state.contest.isRegisterModalActive, mutation: 'contest/setIsRegisterModalActive' }
    }),
    problemRows () {
      if (this.problems == null) {
        return []
      }
      let rows = []
      let count = 0
      this.problems.forEach((val) => {
        if (count % 4 === 0) {
          rows.push([])
        }
        rows[Math.floor(count / 4)].push(val)
        ++count
      })
      return rows
    }
  },
  methods: {
    generateRandomTypeColor () {
      let count = 0
      this.problemTypes.forEach((val) => {
        this.typeColor[val] = this.colorList[count]
        count = (count + 1) % this.colorList.length
      })
    },
    load () {
      if (this.isNotParticipated && !this.isCurrentTeamLoading) {
        this.isCurrentTeamLoading = true
        this.loadCurrentTeam({ contestID: this.$route.params.contestID })
          .finally(() => {
            this.isCurrentTeamLoading = false
          })
      }
      if (!this.isProblemLoading) {
        this.isProblemLoading = true
        this.loadProblems({ contestID: this.$route.params.contestID })
          .finally(() => {
            this.isProblemLoading = false
          })
      }
    },
    ...mapActions({
      loadProblems: 'contest/loadProblems',
      loadCurrentTeam: 'contest/loadCurrentTeam'
    })
  },
  watch: {
    isProblemLoading (to, from) {
      if (to === false) {
        this.generateRandomTypeColor()
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
  .problem-info {
    width: 100%;
  }
  .problem-info:hover {
    cursor: pointer;
    background-color: whitesmoke;
    color: #363636;
  }
  .problem-info:hover>.title {
    color: #363636;
  }
  .problem-info:hover>.subtitle {
    color: #363636;
  }
  .problem-info>.title {
    font-size: 25px;
  }
  .problem-info>.subtitle {
    font-size: 20px;
  }
  .publish-time {
    font-size: 15px;
  }
  .problem-info .heading span {
    float: right;
  }
</style>
