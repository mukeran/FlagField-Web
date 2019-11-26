<template>
  <section>
    <br>
    <div class="title-body">
      <span class="title">Notifications</span>
    </div>
    <br>
    <h2 class="subtitle">Unread
      <!--      <button class="button field" @click="markAll">-->
      <!--        <b-icon icon="close"></b-icon>-->
      <!--        <span>Mark all as read</span>-->
      <!--      </button>-->
    </h2>
    <hr>
    <div class="root">
      <template v-for="(item, i) in notifications">
        <b-notification :key="i" v-if="!item.is_read" class="item is-success" @close="() => readNotification(item.id)">
          {{ item.content }}
        </b-notification>
      </template>
    </div>
    <br>
    <h2 class="subtitle">All</h2>
    <hr>
    <div class="root">
      <template v-for="(item, i) in notifications">
        <b-notification :key="i" class="item" :closable="false">
          {{new Date(item.create_time).toLocaleString()}} <br>
          {{ item.content }}
        </b-notification>
      </template>
    </div>
  </section>
</template>

<script>
import notification from '../../api/notification'

export default {
  name: 'Notification',
  data () {
    return {
      notifications: [],
      isLoading: false,
      checkedNotifications: []
    }
  },
  methods: {
    loadNotification () {
      this.isLoading = true
      notification.all({})
        .then((res) => {
          this.notifications = (res.data.notifications || []).reverse()
        })
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    markAll () {
    },
    readNotification (n) {
      notification.read(n)
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadNotification()
    })
  }
}
</script>

<style scoped>
  .subtitle {
    font-family: Lato, sans-serif;
    font-size: 1.5rem;
  }

  .root {
    margin: 0 auto;
    column-count: 1;
    column-gap: 2%;
  }

  @media (min-width: 628px) {
    .root {
      margin: 0 auto;
      column-count: 3;
      column-gap: 2%;
    }
  }

  .item {
    break-inside: avoid;
  }
</style>
