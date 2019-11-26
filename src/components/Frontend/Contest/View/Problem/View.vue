<template>
  <div>
    <div class="level">
      <div class="level-left">
        <router-link :to="`/contest/${contestID}/problem`">&lt; Back to problem list</router-link>
      </div>
    </div>
    <section :style="{ position: 'relative' }">
      <template v-if="problem !== null">
        <section class="has-text-centered">
          <h1 class="title">
            <template v-if="isLoading">Loading... <b-icon icon="loading" custom-class="mdi-spin"></b-icon></template>
            <template v-else>{{ problem.name }} <b-icon v-show="solvedProblems.has(problem.alias)" icon="check" size="is-medium" type="is-success"></b-icon></template>
          </h1>
          <h2 class="subtitle">
            <template v-if="isLoading">Loading... <b-icon icon="loading" custom-class="mdi-spin"></b-icon></template>
            <template v-else>{{ problem.points }}</template>
             pts
          </h2>
        </section>
        <section class="section">
          <div class="tile is-ancestor">
            <div class="tile is-vertical is-8">
              <div class="tile is-parent">
                <div class="tile is-child box">
                  <p class="heading">Description</p>
                  <template v-if="isLoading">Loading... <b-icon icon="loading" custom-class="mdi-spin"></b-icon></template>
                  <template v-else><div class="content" v-html="description"></div></template>
                </div>
              </div>
              <div class="tile is-parent">
                <b-field class="tile is-child" label="Submit Flag" label-position="on-border" type="is-primary">
                  <b-input placeholder="Flag" v-model="flag" icon="flag" size="is-large" @keyup.enter.native="submitFlag" :disabled="isLoading || isSubmittingFlag || solvedProblems.has(problem.alias)" expanded></b-input>
                  <p class="control">
                    <b-button class="button is-primary" type="is-large" @click="submitFlag" :loading="isSubmittingFlag" :disabled="isLoading || isSubmittingFlag || solvedProblems.has(problem.alias)">Submit</b-button>
                  </p>
                </b-field>
              </div>
            </div>
            <div class="tile is-vertical">
              <div class="tile is-parent">
                <div class="tile is-child box">
                  <p class="heading">Hint</p>
                  <div class="content hint-list">
                    <template v-if="isLoading || hints === null || hints.length === 0">
                      <div class="content has-text-grey has-text-centered">
                        <p>
                          <b-icon
                            icon="emoticon-sad"
                            size="is-large">
                          </b-icon>
                        </p>
                        <p>No hint founded.</p>
                      </div>
                    </template>
                    <template v-else>
                      <template v-for="(hint, i) in hints">
                        <div class="hint-block" :key="i" @click="switchHintShowing(i)" :style="{ position: 'relative' }">
                          <template v-if="hint.is_unlocked">
                            <template v-if="hint.is_showing">
                              <div v-html="$md.makeHtml(hint.content)"></div>
                            </template>
                            <template v-else>
                              <b-icon icon="lock-open" size="is-small"></b-icon>
                              <span>Hint <b-tag type="is-info">{{ i + 1 }}</b-tag> Unlocked. Click to see.</span>
                            </template>
                          </template>
                          <template v-else>
                            <b-icon icon="lock" size="is-small"></b-icon>
                            <span>Unlock Hint <b-tag type="is-info">{{ i + 1 }}</b-tag> for <b-tag type="is-danger">{{ hint.cost }}</b-tag> pts</span>
                          </template>
                          <b-loading :is-full-page="false" :active.sync="hint.is_loading"></b-loading>
                        </div>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
              <div class="tile is-parent">
                <div class="tile is-child"></div>
              </div>
            </div>
          </div>
        </section>
      </template>
      <template v-else>
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large">
            </b-icon>
          </p>
          <p>No such practice.</p>
        </div>
      </template>
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import problem from '../../../../../api/problem'
export default {
  name: 'ContestProblemView',
  data () {
    return {
      contestID: 0,
      flag: '',
      isLoading: false,
      isSubmittingFlag: false
    }
  },
  methods: {
    activateProblem () {
      this.isLoading = true
      let contestID = this.contestID
      let p1 = this.$store.dispatch('contest/activateProblem', { contestID: contestID, problemAlias: this.problemAlias })
      let p2 = this.$store.dispatch('contest/activateHints', { contestID: contestID, problemAlias: this.problemAlias })
      Promise.all([p1, p2])
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    switchHintShowing (order) {
      let contestID = this.contestID
      if (this.hints[order].is_showing) {
        this.$store.commit('contest/toggleActiveHint', order + 1)
      } else {
        if (this.hints[order].is_unlocked) {
          this.$store.commit('contest/toggleActiveHint', order + 1)
        } else {
          this.$store.dispatch('contest/unlockHint', { contestID: contestID, problemAlias: this.problemAlias, hintOrder: order + 1 })
            .then((res) => {
              this.$store.commit('contest/toggleActiveHint', order + 1)
            })
            .catch((res) => {
              if (typeof (res.status) === 'undefined' || res.status === this.$const.status.SERVER_ERROR) {
                this.$buefy.toast.open({
                  message: 'Something wrong with the connection.',
                  type: 'is-danger'
                })
              } else if (res.status === this.$const.status.NOT_FOUND) {
                this.$buefy.toast.open({
                  message: 'Failed to unlock hint. Maybe the problem has been edited or you don\'t have permission.',
                  type: 'is-danger'
                })
              } else if (res.status === this.$const.status.NOT_ENOUGH_POINTS) {
                this.$buefy.toast.open({
                  message: 'Not enough points!',
                  type: 'is-danger'
                })
              }
            })
        }
      }
    },
    submitFlag () {
      let contestID = this.contestID
      if (this.flag === '') {
        return
      }
      this.isSubmittingFlag = true
      problem.submitFlag(contestID, this.problemAlias, this.flag)
        .then((res) => {
          if (res.data.result === this.$const.submission_result.CORRECT) {
            this.$store.commit('contest/addSolvedProblem', { alias: this.problemAlias })
            this.$buefy.toast.open({
              message: 'Congratulations! You successfully solved this problem!',
              type: 'is-success'
            })
          } else {
            this.$buefy.toast.open({
              message: 'Ops! Wrong flag!',
              type: 'is-danger'
            })
          }
        })
        .catch((res) => {
          if (typeof (res.status) === 'undefined' || res.status === this.$const.status.SERVER_ERROR) {
            this.$buefy.toast.open({
              message: 'Something wrong with the connection.',
              type: 'is-danger'
            })
          }
        })
        .finally(() => {
          this.isSubmittingFlag = false
        })
    }
  },
  computed: {
    ...mapState({
      problem: state => state.contest.activeProblem,
      hints: state => state.contest.activeHints,
      solvedProblems: state => state.contest.solvedProblems
    }),
    description () {
      return this.$md.makeHtml(this.problem.description)
    },
    problemAlias () {
      return this.$route.params.problemAlias
    }
  },
  beforeRouteEnter (from, to, next) {
    next(vm => {
      // console.log(vm)
      vm.contestID = vm.$route.params.contestID
      // console.log('contestID')
      // console.log(vm.contestID)
      vm.activateProblem()
    })
  }
}
</script>

<style scoped>

</style>
