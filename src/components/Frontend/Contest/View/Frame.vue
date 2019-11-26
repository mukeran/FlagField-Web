<template>
  <section class="section">
    <router-link :to="{ name: 'contestList' }">&lt; Back to Contest List</router-link>
    <template v-if="isNotFound">
      <div class="content has-text-grey has-text-centered">
        <p>
          <b-icon
            icon="emoticon-sad"
            size="is-large">
          </b-icon>
        </p>
        <p>No such contest.</p>
      </div>
    </template>
    <template v-else>
      <p class="title is-3">
        <template v-if="isLoading || contest === null">
          Loading... <b-icon icon="loading" custom-class="mdi-spin"></b-icon>
        </template>
        <template v-else>{{ contest.name }}</template>
      </p>
      <div class="columns">
        <div class="column is-one-quarter">
          <b-menu>
            <b-message :type="countDownType" class="countdown">
              <template v-if="isLoading || contest === null">Loading... <b-icon icon="loading" custom-class="mdi-spin"></b-icon></template>
              <template v-else-if="contestStatus === 0">Contest will start in {{ countDownString }}</template>
              <template v-else-if="contestStatus === 1">Contest will end in {{ countDownString }}</template>
              <template v-else>Contest has ended</template>
            </b-message>
            <b-menu-list label="Menu">
              <b-menu-item icon="information-variant" label="Info" tag="router-link" :to="{ name: 'contestView' }" :active="isInfo"></b-menu-item>
              <b-menu-item icon="help" label="Problem" tag="router-link" :to="{ name: 'contestViewProblemList' }" :active="isProblemList"></b-menu-item>
              <b-menu-item icon="chart-timeline-variant" label="Rank" tag="router-link" :to="{ name: 'contestViewRank' }" :active="isRank"></b-menu-item>
              <b-menu-item icon="account-multiple" label="My Team" tag="router-link" :to="{ name: 'contestViewTeam' }" :active="isTeam"></b-menu-item>
              <b-menu-item icon="bell-outline" label="Notifications" tag="router-link" :to="{ name: 'contestViewNotification' }" :active="isNotification"></b-menu-item>
            </b-menu-list>
            <b-menu-list label="Actions">
              <b-menu-item v-if="isNotParticipated && contestStatus !== 2" icon="account-plus" label="Register" @click="isRegisterModalActive = true"></b-menu-item>
              <b-menu-item v-if="!isLoading && contestStatus === 0 && isTeamAdmin" icon="exit-to-app" label="Leave Contest" @click="launchLeaveContest"></b-menu-item>
              <b-menu-item v-if="!contestStatus === 1"  icon="upload" label="Quick Submit Flag" @click="launchQuickSubmitFlag"></b-menu-item>
            </b-menu-list>
          </b-menu>
        </div>
        <div class="column">
          <template v-if="isInfo">
            <div style="position: relative">
              <template v-if="isLoading || contest === null">Loading... <b-icon icon="loading" custom-class="mdi-spin"></b-icon></template>
              <template v-else>
                <div class="contest-description markdown-body" v-html="description"></div>
                <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
              </template>
            </div>
          </template>
          <router-view></router-view>
        </div>
      </div>
    </template>
    <b-modal
      :active.sync="isRegisterModalActive"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal>
      <register></register>
    </b-modal>
  </section>
</template>

<script>
import Register from './Register'
import { mapState } from 'vuex'
import { mapIsRoute, mapFlag } from '../../../../common'
import contest from '../../../../api/contest'
import problem from '../../../../api/problem'

export default {
  name: 'ViewFrame',
  components: { Register },
  data () {
    return {
      mainReloadInterval: null,
      notificationReloadInterval: null,
      countDown: 0,
      countDownInterval: null,
      lastLoadNotificationTime: new Date(),
      statusUpdateInterval: null
    }
  },
  computed: {
    ...mapIsRoute({
      isInfo: 'contestView',
      isProblemList: 'contestViewProblemList',
      isRank: 'contestViewRank',
      isTeam: 'contestViewTeam',
      isNotification: 'contestViewNotification'
    }),
    ...mapState({
      contest: state => state.contest.active,
      isNotFound: state => state.contest.isNotFound,
      isNotParticipated: state => state.contest.isNotParticipated,
      session: state => state.session.logged,
      isTeamAdmin: state => state.contest.isTeamAdmin,
      contestStatus: state => state.contest.activeStatus
    }),
    ...mapFlag({
      isLoading: { state: state => state.contest.isLoading, mutation: 'contest/setIsLoading' },
      isProblemLoading: { state: state => state.contest.isProblemLoading, mutation: 'contest/setIsProblemLoading' },
      isCurrentTeamLoading: { state: state => state.contest.isCurrentTeamLoading, mutation: 'contest/setIsCurrentTeamLoading' },
      isNotificationLoading: { state: state => state.contest.isNotificationLoading, mutation: 'contest/setIsNotificationLoading' },
      isRealtimeNotificationLoading: { state: state => state.contest.isRealtimeNotificationLoading, mutation: 'contest/setIsRealtimeNotificationLoading' },
      isRegisterModalActive: { state: state => state.contest.isRegisterModalActive, mutation: 'contest/setIsRegisterModalActive' }
    }),
    description () {
      return this.$md.makeHtml(this.contest.description)
    },
    countDownString () {
      let d = Math.floor(this.countDown / 60 / 60 / 24)
      let h = Math.floor(this.countDown / 60 / 60 % 24)
      let m = Math.floor(this.countDown / 60 % 60)
      let s = Math.floor(this.countDown % 60)
      return `${d}:${h}:${m}:${s}`
    },
    countDownType () {
      if (this.isLoading || this.contest === null) {
        return 'is-dark'
      } else if (this.contestStatus === 0) {
        return 'is-warning'
      } else if (this.contestStatus === 1) {
        return 'is-success'
      } else {
        return 'is-danger'
      }
    }
  },
  methods: {
    resetCountDown () {
      if (this.countDownInterval !== null) {
        window.clearInterval(this.countDownInterval)
        this.countDownInterval = null
        this.countDown = 0
      }
      let startTime = new Date(this.contest.start_time)
      let endTime = new Date(this.contest.end_time)
      let currentTime = new Date()
      if (startTime > currentTime) {
        this.countDown = Math.floor((startTime - currentTime) / 1000)
      } else if (startTime < currentTime && currentTime < endTime) {
        this.countDown = Math.floor((endTime - currentTime) / 1000)
      } else {
        return
      }
      this.countDownInterval = window.setInterval(() => {
        this.countDown -= 1
        if (this.countDown <= 0) {
          window.clearInterval(this.countDownInterval)
          this.countDownInterval = null
          this.load()
        }
      }, 1000)
    },
    async load () {
      this.isLoading = this.isProblemLoading = this.isCurrentTeamLoading = this.isNotificationLoading = true
      await this.$store.dispatch('contest/loadAll', { contestID: this.$route.params.contestID })
        .finally(() => {
          this.isLoading = this.isProblemLoading = this.isCurrentTeamLoading = this.isNotificationLoading = false
          if (this.endTime < this.currentTime) {
            this.destroyAutoReload()
          }
        })
    },
    registerAutoReload () {
      if (this.mainReloadInterval === null) {
        this.mainReloadInterval = window.setInterval(() => {
          if (!this.isLoading) {
            this.load()
          }
        }, 60000)
      }
      if (this.notificationReloadInterval === null) {
        this.isRealtimeNotificationLoading = false
        this.notificationReloadInterval = window.setInterval(async () => {
          if (!this.isRealtimeNotificationLoading) {
            this.isRealtimeNotificationLoading = true
            await contest.getNotificationList(this.$route.params.contestID, {
              from: this.lastLoadNotificationTime.toISOString()
            })
              .then((res) => {
                if (res.data.notifications !== null) {
                  res.data.notifications.reverse().forEach(value => {
                    this.$buefy.notification.open({
                      message: value.content,
                      type: 'is-info',
                      queue: false,
                      indefinite: true,
                      position: 'is-top-right'
                    })
                  })
                }
                this.lastLoadNotificationTime = new Date(res.data.request_time)
              })
              .finally(() => {
                this.isRealtimeNotificationLoading = false
              })
          }
        }, 5000)
      }
      if (this.statusUpdateInterval === null) {
        this.statusUpdateInterval = window.setInterval(() => {
          this.$store.commit('contest/updateActiveStatus')
        }, 1000)
      }
    },
    destroyAutoReload () {
      if (this.countDownInterval !== null) {
        window.clearInterval(this.countDownInterval)
        this.countDownInterval = null
      }
      if (this.mainReloadInterval !== null) {
        window.clearInterval(this.mainReloadInterval)
        this.mainReloadInterval = null
      }
      if (this.notificationReloadInterval !== null) {
        window.clearInterval(this.notificationReloadInterval)
        this.notificationReloadInterval = null
      }
      if (this.statusUpdateInterval !== null) {
        window.clearInterval(this.statusUpdateInterval)
        this.statusUpdateInterval = null
      }
    },
    quickSubmitFlag (value) {
      let pos = value.indexOf(';')
      if (pos === -1) {
        this.$buefy.toast.open({
          message: 'Wrong quick submit format!',
          type: 'is-danger'
        })
      } else {
        let problemAlias = value.slice(0, pos)
        let flag = value.slice(pos + 1)
        problem.submitFlag(this.$route.params.contestID, problemAlias, flag)
          .then((res) => {
            if (res.data.result === this.$const.submission_result.CORRECT) {
              this.$store.commit('contest/addSolvedProblem', { alias: problemAlias })
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
          .catch(() => {
            this.$buefy.toast.open({
              message: 'Error occurs when submitting flag!',
              type: 'is-danger'
            })
          })
      }
    },
    launchQuickSubmitFlag () {
      this.$buefy.dialog.prompt({
        message: `Input a pair of problem alias and flag, separate with ';'.<br>e.g. "problem1;flag{problem1_is_fun}"`,
        inputAttrs: {
          placeholder: '{problemAlias};{flag}'
        },
        trapFocus: true,
        onConfirm: (value) => this.quickSubmitFlag(value)
      })
    },
    leaveContest () {
      contest.leaveContest(this.$route.params.contestID)
        .then(() => {
          this.$buefy.toast.open({
            message: 'Successfully leaved contest',
            type: 'is-success'
          })
          this.load()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: 'Error occurs when leaving contest',
            type: 'is-danger'
          })
        })
    },
    launchLeaveContest () {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to leave the contest?',
        onConfirm: () => this.leaveContest()
      })
    }
  },
  watch: {
    isLoading (to, from) {
      if (to === false) {
        this.resetCountDown()
      }
    },
    $route (to, from) {
      if (to.params.contestID !== from.params.contestID) {
        this.destroyAutoReload()
        this.load()
        this.registerAutoReload()
      }
    },
    isRegisterModalActive (to, from) {
      if (to === false) {
        this.load()
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.load()
      vm.registerAutoReload()
    })
  },
  beforeRouteLeave (to, from, next) {
    this.destroyAutoReload()
    this.$store.commit('contest/clearState')
    next()
  }
}
</script>

<style scoped>
@media only screen and (max-width: 768px) {
  .register-modal {
    width: 100%;
  }
}
@media only screen and (min-width: 769px)  {
  .register-modal {
    width: 500px;
  }
}
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 0 15px;
  }
}
.countdown {
  font-size: 1.15rem;
}
</style>
