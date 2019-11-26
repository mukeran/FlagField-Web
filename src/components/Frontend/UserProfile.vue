<template>
  <section class="section" :style="{ position: 'relative' }">
    <template v-if="user === null">
      <div class="content has-text-grey has-text-centered">
        <p>
          <b-icon
            icon="emoticon-sad"
            size="is-large">
          </b-icon>
        </p>
        <p>No such user.</p>
      </div>
    </template>
    <template v-else>
      <div class="media">
        <div class="media-left">
          <img class="avatar" :src="`https://www.gravatar.com/avatar/${user.email_hash}`" alt="avatar" width="80" height="80">
        </div>
        <div class="media-content" style="padding: 18px 0 0 10px;">
          <p class="title is-2" style="font-weight: normal">{{ user.username }}</p>
        </div>
        <div class="media-right" style="padding-top: 20px">
          <b-button type="is-primary" size="is-medium" tag="router-link" :to="{ name: 'settingsProfile' }" v-if="isCurrentUser">Settings</b-button>
        </div>
      </div>
      <div class="tile is-ancestor" style="margin-top: 10px">
        <div class="tile is-vertical is-8">
          <div class="tile is-parent">
            <div class="tile is-child notification description is-warning">
              <p class="heading">Description</p>
              <p class="content">
                <template v-if="user.profile.description === ''">
                  This man is too lazy to write his/her description! &gt;_&lt;
                </template>
                <template v-else>
                  {{ user.profile.description }}
                </template>
              </p>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child notification site is-dark">
              <p class="heading">Page</p>
              <p class="content">
                <template v-if="user.profile.page === ''">No link here &gt;_&lt;.</template>
                <template v-else><a :href="user.profile.page">{{ user.profile.page }}</a></template>
              </p>
            </div>
          </div>
          <div class="tile is-parent">
            <div class="tile is-child notification statistic is-info">
              <p class="heading">Practice Statistic</p>
              <div class="content">
              </div>
            </div>
          </div>
        </div>
        <div class="tile is-parent">
          <div class="tile is-child notification">
            <p class="heading">Character</p>
            <div class="content has-text-grey has-text-centered" style="margin-top: 50px">
              <p>
                <b-icon
                  icon="emoticon-confused"
                  size="is-large">
                </b-icon>
              </p>
              <p>I am not sure yet...</p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import user from '../../api/user'

export default {
  name: 'User',
  data () {
    return {
      isLoading: false,
      user: null
    }
  },
  computed: {
    ...mapState({
      session: state => state.session.logged
    }),
    isCurrentUser () {
      if (this.session === null) {
        return false
      }
      return this.session.user_id === this.user.id
    }
  },
  methods: {
    load () {
      this.isLoading = true
      user.getByID(this.$route.params.userID)
        .then(({data}) => {
          this.user = data.user
        })
        .catch(({response}) => {
          this.user = null
          this.$buefy.toast.open({
            message: `Failed to load user. Message: ${response.data.message}`
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  },
  watch: {
    $route (from, to) {
      if (from.params.userID !== to.params.userID) {
        this.load()
      }
    }
  },
  beforeRouteEnter (from, to, next) {
    next(vm => {
      vm.load()
    })
  }
}
</script>

<style scoped>
.avatar::after {
  content: "";
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: url('https://www.gravatar.com/avatar') no-repeat center;
}
.description {
  min-height: 150px;
}
.statistic {
  height: 300px;
}
</style>
