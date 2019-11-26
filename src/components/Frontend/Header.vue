<template>
  <section :class="['hero', 'is-bold', title.color]">
    <div class="hero-header">
      <b-navbar id="navBar" :type="title.color">
        <template slot="brand">
          <b-navbar-item tag="router-link" :to="{ path: '/' }" id="navBar-logo">
            <b-icon
              icon="flag"
              size="is-small"
            ></b-icon>&nbsp;
            FlagField
          </b-navbar-item>
        </template>
        <template slot="start">
          <b-navbar-item tag="router-link" :to="{ name: 'index' }" :active="isIndex">
            Home
          </b-navbar-item>
          <b-navbar-item tag="router-link" :to="{ name: 'practiceList' }" :active="isPracticeList">
            Practices
          </b-navbar-item>
          <b-navbar-item tag="router-link" :to="{ name: 'rank' }" :active="isRank">
            Rank
          </b-navbar-item>
          <b-navbar-item tag="router-link" :to="{ name: 'contestList' }" :active="isContestList">
            Contests
          </b-navbar-item>
          <b-navbar-item tag="router-link" :to="{ name: 'about' }" :active="isAbout">
            About
          </b-navbar-item>
        </template>
        <template slot="end">
          <template v-if="!isLoggedIn">
            <b-navbar-item tag="div" key="login">
              <b-button type="is-primary" tag="router-link" :to="{ name: 'login', query: { path: $route.fullPath } }">
                <strong>Sign up / Log in</strong>
              </b-button>
            </b-navbar-item>
          </template>
          <template v-else>
            <b-navbar-item v-if="$store.state.session.logged.is_admin" tag="router-link" :to="{ name: 'manageIndex' }">
              Manage
            </b-navbar-item>
            <b-dropdown position="is-bottom-left" aria-role="menu" trap-focus>
              <a
                class="navbar-item"
                slot="trigger"
                role="button">
                <b-icon
                  icon="bell"
                  size="is-small">
                </b-icon>
                <b-icon icon="menu-down"></b-icon>
              </a>
              <b-dropdown-item
                has-link>
                <router-link :to="{ name: 'notification' }">Details</router-link>
              </b-dropdown-item>
              <b-dropdown-item
                aria-role="notification-item"
                :focusable="false"
                custom
                paddingless>
                <template v-for="(item, n) in (notifications !== null ? this.notifications : [])">
                <b-notification :key="n" :active="!item.is_read" aria-close-label="Close notification" @close="() => readNotification(item.id)">
                  <!--                  From: {{item.id}} <br>-->
                  {{item.content}}
                  <!--                  {{item.create_time}}-->
                </b-notification>
                </template>
              </b-dropdown-item>
            </b-dropdown>
            <b-navbar-dropdown :label="session.username" key="user">
              <b-navbar-item tag="router-link" :to="{ name: 'userProfile', params: { userID: session.user_id } }">Profile</b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ name: 'settings' }">Settings</b-navbar-item>
              <b-navbar-item tag="router-link" :to="{ name: 'teamList' }">Team</b-navbar-item>
              <b-navbar-item tag="a" @click.native="logout()">Logout</b-navbar-item>
            </b-navbar-dropdown>
          </template>
        </template>
      </b-navbar>
    </div>
    <div class="hero-body" v-show="showTitle">
      <div class="container has-text-centered">
        <h1 class="title">
          {{ title.title }}
        </h1>
        <h2 class="subtitle">
          {{ title.subtitle }}
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import notification from '../../api/notification'
export default {
  name: 'Header',
  data () {
    return {
      titles: new Map([
        ['index', {
          title: 'Welcome to FlagField',
          subtitle: 'Start to hack the world',
          color: ''
        }],
        ['practiceList', {
          title: 'Practices',
          subtitle: 'Climb to the top step by step',
          color: 'is-info'
        }],
        ['rank', {
          title: 'Rank',
          subtitle: 'Learn from others',
          color: 'is-success'
        }],
        ['contestList', {
          title: 'Contests',
          subtitle: 'Be the top star',
          color: 'is-warning'
        }],
        ['about', {
          title: 'About',
          subtitle: 'What\'s behind FlagField',
          color: 'is-dark'
        }]
      ]),
      defaultTitle: {
        title: '',
        subtitle: '',
        color: ''
      },
      title: this.defaultTitle,
      showTitle: true,
      notifications: null,
      isLoadingN: false
    }
  },
  computed: {
    ...mapState({
      isLoggedIn: state => state.session.isLoggedIn,
      session: state => state.session.logged
    }),
    isIndex () {
      return this.$route.name === 'index'
    },
    isPracticeList () {
      return this.$route.name === 'practiceList'
    },
    isRank () {
      return this.$route.name === 'rank'
    },
    isContestList () {
      return this.$route.name === 'contestList'
    },
    isAbout () {
      return this.$route.name === 'about'
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('session/logout')
        .then((res) => {
          this.$router.go(0)
        })
        .catch((err) => {
          console.log(err, err.response)
        })
    },
    setHero (name) {
      if (this.titles.has(name)) {
        this.showTitle = true
        this.title = this.titles.get(name)
      } else {
        this.showTitle = false
        this.title = this.defaultTitle
      }
    },
    getNotification () {
      if (this.$store.state.session.isLoggedIn === false) {
        this.notifications = null
        return
      }
      this.isLoadingN = true
      notification.list()
        .then((res) => {
          this.notifications = res.data.notifications
        }).catch((err) => {
          this.notifications = null
          this.$store.dispatch('session/informConnectionError', err)
        }).finally(() => {
          this.isLoadingN = false
        })
    },
    readNotification (n) {
      notification.read(n)
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
    }
  },
  watch: {
    '$route' (to, from) {
      this.setHero(to.name)
      this.getNotification()
    }
  },
  created () {
    this.setHero(this.$route.name)
    this.getNotification()
  }
}
</script>

<style scoped>
#navBar {
  /*border-bottom: 1px rgba(255,255,255,0.96);*/
}
#navBar-logo {
  font-size: 20px;
}

.notification:not(:last-child) {
  margin-bottom: 0.5rem;
}
</style>
