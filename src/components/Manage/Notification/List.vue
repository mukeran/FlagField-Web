<template>
  <section class="section">
    <div class="title-body">
      <new-notification><span class="title">Notifications </span></new-notification>
    </div>
    <div class="level">
      <div class="level-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checkedNotifications = []" :disabled="!checkedNotifications.length">
            <b-icon icon="close"></b-icon>
            <span>Clear checked</span>
          </button>
          <button class="button field is-danger" @click="deleteCheckedNotifications" :disabled="!checkedNotifications.length">
            <b-icon icon="delete-forever"></b-icon>
            <span>Delete checked</span>
          </button>
        </b-field>
      </div>
      <div class="level-right">
        <b-field>
          <b-input
            placeholder="Search..."
            type="search"
            icon="magnify">
          </b-input>
          <p class="control">
            <button class="button is-primary">Search</button>
          </p>
        </b-field>
      </div>
    </div>
    <b-table
      :data="notifications !== null ? notifications : []"
      :loading="isLoading"
      @click="showDetail"
      hoverable
      striped
      :row-class="() => 'list-row'"
      checkable
      :checked-rows.sync="checkedNotifications"
      paginated
      per-page=15
      current-page.sync=1
      pagination-position="bottom"
      default-sort-direction="asc"
      sort-icon="arrow-up"
      sort-icon-size="is-small"
      default-sort="team_id"
      aria-next-label="Next page"
      aria-previous-label="Previous page"
      aria-page-label="Page"
      aria-current-label="Current page">

      <template slot-scope="props">
        <b-table-column field="id" label="ID" width="40" sortable numeric>
          {{ props.row.id }}
        </b-table-column>
        <b-table-column field="user_id" label="User ID" width="80" sortable numeric>
          {{ props.row.user_id }}
        </b-table-column>

        <b-table-column field="is_read" label="Is Read" sortable>
          {{ props.row.is_read ? 'Yes' : 'No' }}
        </b-table-column>

        <b-table-column field="create_time" label="Create Time" sortable centered>
          {{ new Date(props.row.create_time).toLocaleString() }}
        </b-table-column>
      </template>
      <template slot="detail" slot-scope="props">
        {{ props.row.content }}
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
            <p>Nothing here.</p>
          </div>
        </section>
      </template>
      <template slot="bottom-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checkedNotifications = []" :disabled="!checkedNotifications.length">
            <b-icon icon="close"></b-icon>
            <span>Clear checked</span>
          </button>
          <button class="button field is-danger" @click="deleteCheckedNotifications" :disabled="!checkedNotifications.length">
            <b-icon icon="delete-forever"></b-icon>
            <span>Delete checked</span>
          </button>
        </b-field>
      </template>
    </b-table>
  </section>
</template>

<script>
import notification from '../../../api/notification'
import NewNotification from './New'
export default {
  name: 'Notification',
  components: {NewNotification},
  // without backend pagenation now
  data () {
    return {
      isLoading: false,
      notifications: [],
      checkedNotifications: []
    }
  },
  methods: {
    loadNotification () {
      this.isLoading = true
      notification.all({all: 1})
        .then((res) => {
          this.notifications = res.data.notifications
        })
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    deleteCheckedNotifications () {
      let req = []
      this.checkedNotifications.forEach((val, key) => {
        req.push(val.id)
      })
      notification.delete(req).then((res) => {
        this.$buefy.toast.open({
          message: res.data.message,
          type: 'is-success'
        })
        this.loadNotification()
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      })
    },
    showDetail (row) {
      this.$buefy.dialog.alert(row.content)
    }
  },
  watch: {
    '$route' (from, to) {
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.loadNotification()
    })
  }
}
</script>

<style>
.title {
  font-family: Lato, sans-serif;
  font-weight: normal;
}
.title-body {
  margin-bottom: 30px;
}
.list-row:hover {
  cursor: pointer;
}
</style>
