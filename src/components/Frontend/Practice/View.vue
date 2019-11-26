<template>
  <section class="section">
    <div class="level">
      <div class="level-left">
        <router-link :to="`/practice/`">&lt; Back to practice list</router-link>
      </div>
    </div>
    <section :style="{ position: 'relative' }">
      <template v-if="problem !== null">
        <section class="has-text-centered">
          <h1 class="title">
            {{ problem.name }}
          </h1>
          <h2 class="subtitle">
            {{ problem.points }} pts
          </h2>
        </section>
        <section class="section">
          <div class="tile is-ancestor">
            <div class="tile is-vertical is-8">
              <div class="tile is-parent">
                <div class="tile is-child box">
                  <p class="heading">Description</p>
                  <div class="content" v-html="description"></div>
                </div>
              </div>
              <div class="tile is-parent">
                <b-field class="tile is-child" label="Submit Flag" label-position="on-border" type="is-primary">
                  <b-input placeholder="Flag" v-model="flag" icon="flag" size="is-large" @keyup.enter.native="submitFlag" :disabled="isSubmittingFlag" expanded></b-input>
                  <p class="control">
                    <b-button class="button is-primary" type="is-large" @click="submitFlag" :loading="isSubmittingFlag">Submit</b-button>
                  </p>
                </b-field>
              </div>
            </div>
            <div class="tile is-vertical">
              <div class="tile is-parent">
                <div class="tile is-child box">
                  <p class="heading">Hint</p>
                  <div class="content hint-list">
                    <template v-if="hints === null">
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
          <div class="box">
            <p class="heading">Statistics</p>
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
  </section>
</template>

<script>
import { mapState } from 'vuex'
import problem from '../../../api/problem'
export default {
  name: 'PracticeView',
  data () {
    return {
      flag: '',
      isLoading: false,
      isSubmittingFlag: false
    }
  },
  methods: {
    activateProblem () {
      this.isLoading = true
      this.$store.dispatch('contest/activateProblem', { contestID: '__practice__', problemAlias: this.problemAlias })
        .then((res) => {
          this.$store.dispatch('contest/activateHints', { contestID: '__practice__', problemAlias: this.problemAlias })
            .then((res) => {
              this.isLoading = false
            })
            .catch((err) => {
              this.$store.dispatch('session/informConnectionError', err)
            })
        })
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
    },
    switchHintShowing (order) {
      if (this.hints[order].is_showing) {
        this.$store.commit('contest/toggleActiveHint', order + 1)
      } else {
        if (this.hints[order].is_unlocked) {
          this.$store.commit('contest/toggleActiveHint', order + 1)
        } else {
          this.$store.dispatch('contest/unlockHint', { contestID: '__practice__', problemAlias: this.problemAlias, hintOrder: order + 1 })
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
      if (this.flag === '') {
        return
      }
      this.isSubmittingFlag = true
      problem.submitFlag('__practice__', this.problemAlias, this.flag).then((res) => {
        this.isSubmittingFlag = false
        if (res.data.result === this.$const.submission_result.CORRECT) {
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
      }).catch((err) => {
        let res = err.response
        this.isSubmittingFlag = false
        if (typeof (res.status) === 'undefined' || res.status === this.$const.status.SERVER_ERROR) {
          this.$buefy.toast.open({
            message: 'Something wrong with the connection.',
            type: 'is-danger'
          })
        }
      })
    }
  },
  computed: {
    ...mapState({
      problem: state => state.contest.activeProblem,
      hints: state => state.contest.activeHints
    }),
    description () {
      return this.$md.makeHtml(this.problem.description)
    },
    problemAlias () {
      return this.$route.params.problemAlias
    }
  },
  watch: {
    '$route' (from, to) {
      this.activateProblem()
    }
  },
  beforeRouteEnter (from, to, next) {
    next(vm => {
      vm.activateProblem()
    })
  }
}
</script>

<style scoped>
.hint-list>.hint-block {
  border-bottom: 1px solid #dbdbdb;
  min-height: 50px;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 20px;
}
.hint-list>.hint-block:hover {
  background-color: whitesmoke;
  color: #363636;
  cursor: pointer;
}
.hint-list>.hint-block:last-child {
  border-bottom: 0;
}
</style>
