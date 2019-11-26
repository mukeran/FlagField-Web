<template>
  <section class="section" :style="{ position: 'relative' }">
    <nav class="level">
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle">
            <strong>0</strong>&nbsp;Solved
          </p>
        </div>
        <div class="level-item">
          <p class="subtitle">
            <strong>{{ problemCount }}</strong>&nbsp;Total
          </p>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item is-5">
          <b-field>
            <b-taginput
              placeholder="Search..."
              :ellipsis="true"
              icon="magnify">
            </b-taginput>
            <p class="control">
              <button class="button is-primary">Search</button>
            </p>
          </b-field>
        </div>
      </div>
    </nav>
    <section class="section">
      <template v-if="problemCount === 0">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large">
            </b-icon>
          </p>
          <p>No practice founded.</p>
        </div>
      </template>
      <template v-else>
        <template v-for="(row, i) in problemRows">
          <div class="tile is-ancestor" :key="i">
            <template v-for="(item, j) in row">
              <div class="tile is-3 is-parent" :key="j">
                <article :class="['title', 'is-child', 'notification', 'problem-info', item.isSolved?'is-light':typeColor.get(item.type) ]" @click="$router.push({ name: 'practiceView', params: {problemAlias: item.alias}})">
                  <p class="heading">{{ item.type }}
                    <b-icon v-if="item.isSolved" icon="check" size="is-small" type="is-success"></b-icon>
                  </p>
                  <p class="title">{{ item.name }}</p>
                  <p class="subtitle">{{ item.points }} pts</p>
                </article>
              </div>
            </template>
          </div>
        </template>
      </template>
      <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
    </section>
    <section>
      <h1 class="title">
        Notifications
      </h1>
      <hr>
      <template v-for="(row, i) in notificationRows">
        <div class="tile is-ancestor" :key="i">
          <template v-for="(item, j) in row">
            <div class="tile is-6 is-parent" :key="j">
              <div :class="['tile', 'is-child', 'notification', item.color ]">
                <p class="publish-time">{{ (new Date(item.published_time)).toLocaleString() }}</p>
                <p class="subtitle">{{ item.content }}</p>
              </div>
            </div>
          </template>
        </div>
      </template>
    </section>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PracticeList',
  data () {
    return {
      isLoading: false,
      colorList: [ 'is-primary', 'is-success', 'is-danger', 'is-warning', 'is-info', 'is-dark' ],
      typeColor: new Map()
    }
  },
  methods: {
    generateRandomTypeColor () {
      let count = 0
      this.problemTypes.forEach((val) => {
        this.typeColor.set(val, this.colorList[count])
        count = (count + 1) % this.colorList.length
      })
    },
    loadView () {
      this.$store.dispatch('session/informLoginFirst')
      this.isLoading = true
      let p1 = this.$store.dispatch('contest/loadNotifications', {contestID: '__practice__'})
      let p2 = this.$store.dispatch('contest/loadProblems', {contestID: '__practice__', teamID: this.$store.state.session.isLoggedIn ? this.$store.state.session.logged.user_id : null})
      Promise.all([p1, p2])
        .then((res) => {
          this.isLoading = false
          this.generateRandomTypeColor()
        })
        .catch((err) => {
          this.isLoading = false
          this.$store.dispatch('session/informConnectionError', err)
        })
    }
  },
  computed: {
    ...mapState({
      problems: state => state.contest.problems,
      problemCount: state => state.contest.problemCount,
      problemTypes: state => state.contest.problemTypes,
      notifications: state => state.contest.notifications
    }),
    problemRows () {
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
    },
    notificationRows () {
      if (this.notifications == null) {
        return
      }
      let rows = []
      let colors = ['is-warning', 'is-info', 'is-success']
      let count = 0
      this.notifications.forEach((val) => {
        val.color = colors[(count % 3)]
        if (count % 2 === 0) {
          rows.push([])
        }
        rows[Math.floor(count / 2)].push(val)
        ++count
      })
      return rows
    }
  },
  watch: {
    '$route' (from, to) {
      this.loadView()
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadView()
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
.problem-info .heading span {
  float: right;
}
.publish-time {
  font-size: 15px;
}
</style>
