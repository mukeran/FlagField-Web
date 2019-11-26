<template>
  <div style="position: relative">
    <template v-if="notifications.length === 0">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large">
            </b-icon>
          </p>
          <p>No notification here.</p>
        </div>
      </section>
    </template>
    <template v-else>
      <div class="notification-list">
        <template v-for="(item, i) in pagedNotification">
          <b-message type="is-info" :key="i">
            [{{ new Date(item.published_time).toLocaleString() }}] {{ item.content }}
          </b-message>
        </template>
      </div>
      <div class="notification-pagination">
        <b-pagination
          :total="notifications.length"
          :current.sync="current"
          order="is-centered"
          :simple="true"
          :per-page="perPage"
          aria-next-label="Next page"
          aria-previous-label="Previous page"
          aria-page-label="Page"
          aria-current-label="Current page">
        </b-pagination>
      </div>
    </template>
    <b-loading :is-full-page="false" :active.sync="isNotificationLoading"></b-loading>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Notification',
  data () {
    return {
      current: 1,
      perPage: 5
    }
  },
  computed: {
    ...mapState({
      notifications: state => state.contest.notifications
    }),
    isNotificationLoading: {
      get () {
        return this.$store.state.contest.isNotificationLoading
      },
      set (value) {
        this.$store.commit('contest/setIsNotificationLoading', value)
      }
    },
    pagedNotification () {
      let start = Math.max(0, this.current - 1) * this.perPage
      return this.notifications.slice(start, start + this.perPage)
    }
  },
  methods: {
    ...mapActions({
      loadNotifications: 'contest/loadNotifications'
    }),
    load () {
      if (this.isNotificationLoading === false) {
        this.isNotificationLoading = true
        this.loadNotifications({ contestID: this.$route.params.contestID })
          .finally(() => {
            this.isNotificationLoading = false
          })
      }
    }
  },
  watch: {
    current (to, from) {
      if (to === 1) {
        // console.log('changed to 1')
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
.notification-list {
  margin-bottom: 1.2rem;
}
</style>
