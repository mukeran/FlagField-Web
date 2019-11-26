<template>
  <div>
    <b-table
      :data="notifications"
      striped
      hoverable
      paginated
      pagination-position="bottom"
      :pagination-simple="true"
      :per-page="10"
      :current-page.sync="currentPage"
      :loading="isLoading">
      <template slot-scope="props">
        <b-table-column field="order" label="Order" sortable>
          {{ props.row.order }}
        </b-table-column>
        <b-table-column field="content" label="Content">
          {{ props.row.content }}
        </b-table-column>
        <b-table-column field="published_time" label="Publish Time" sortable>
          {{ (new Date(props.row.published_time)).toLocaleString() }}
        </b-table-column>
        <b-table-column field="delete" label="Delete" width="40">
          <b-button type="is-danger" size="is-small" @click="deleteNotification(props.row.order)" :disabled="props.row.is_updating">Delete</b-button>
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
            <p>No notification here.</p>
          </div>
        </section>
      </template>
    </b-table>
    <b-modal
      :active.sync="_isNewNotificationModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <new-notification></new-notification>
    </b-modal>
  </div>
</template>

<script>
import NewNotification from './New'
import contest from '../../../../../api/contest'

export default {
  name: 'NotificationList',
  components: { NewNotification },
  props: {
    isNewNotificationModalActive: Boolean
  },
  data () {
    return {
      isLoading: true,
      notifications: [],
      currentPage: 1
    }
  },
  computed: {
    _isNewNotificationModalActive: {
      get () {
        return this.isNewNotificationModalActive
      },
      set (value) {
        this.$emit('on-is-new-notification-modal-active-changed', value)
      }
    }
  },
  methods: {
    load () {
      this.isLoading = true
      contest.getNotificationList(this.$route.params.contestID)
        .then(({data}) => {
          if (data.notifications !== null) {
            data.notifications.reverse()
            for (let i = 0; i < data.notifications.length; i++) {
              data.notifications[i].order = i + 1
              data.notifications[i].is_updating = false
            }
            this.notifications = data.notifications
          } else {
            this.notifications = []
          }
        })
        .catch(({response}) => {

        })
        .finally(() => {
          this.isLoading = false
        })
    },
    deleteNotification (order) {
      this.notifications[order - 1].is_updating = true
      contest.singleDeleteNotification(this.$route.params.contestID, order)
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully deleted notification ${order}`,
            type: 'is-success'
          })
          this.load()
        })
        .catch(({response}) => {
          this.notifications[order - 1].is_updating = false
          this.$buefy.toast.open({
            message: `Failed to delete notification ${order}. Message: ${response.data.message}`,
            type: 'is-danger'
          })
          console.log(response.data)
        })
    }
  },
  watch: {
    isNewNotificationModalActive (to, from) {
      if (to === false) {
        this.load()
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

</style>
