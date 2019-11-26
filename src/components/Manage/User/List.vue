<template>
 <section class="section">
   <div class="title-body">
     <p class="title">Users</p>
   </div>
   <div class="level">
     <div class="level-left"></div>
     <div class="level-right">
       <b-field>
         <b-input
           placeholder="Search..."
           type="search"
           icon="magnify">
         </b-input>
         <div class="control">
           <button class="button is-primary">Search</button>
         </div>
       </b-field>
     </div>
   </div>
   <b-table
     :data="users"
     striped
     hoverable
     paginated
     pagination-position="bottom"
     searchable
     sortable
     :per-page="20"
     :current-page.sync="currentPage"
     :loading="isLoading"
     :row-class="() => 'list-row'">
     <template slot-scope="props">
       <b-table-column field="id" label="ID" width="50" @click.native="enter(props.row.order)" numeric sortable>
         {{ props.row.id }}
       </b-table-column>
       <b-table-column field="username" label="Username" @click.native="enter(props.row.order)" sortable>
         {{ props.row.username }}
       </b-table-column>
       <b-table-column field="email" label="Email" @click.native="enter(props.row.order)">
         {{ props.row.email }}
       </b-table-column>
       <b-table-column field="is_admin" label="Admin" width="40">
         <b-switch v-model="props.row.is_admin" @input="changeAdmin(props.row.order)" :disabled="props.row.is_updating || session.user_id === props.row.id"></b-switch>
       </b-table-column>
       <b-table-column field="delete" label="Delete" width="40">
         <b-button type="is-danger" size="is-small" @click="deleteUser(props.row.order)" :disabled="props.row.is_updating || session.user_id === props.row.id">Delete</b-button>
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
           <p>No users.</p>
         </div>
       </section>
     </template>
   </b-table>
 </section>
</template>

<script>
import { mapState } from 'vuex'
import admin from '../../../api/admin'
import user from '../../../api/user'

export default {
  name: 'manageUsersList',
  data () {
    return {
      isLoading: true,
      users: [],
      currentPage: 1
    }
  },
  computed: {
    ...mapState({
      session: state => state.session.logged
    })
  },
  methods: {
    load () {
      this.isLoading = true
      user.list()
        .then(({data}) => {
          if (data.users !== null) {
            for (let i = 0; i < data.users.length; i++) {
              data.users[i].order = i
              data.users[i].is_admin = typeof data.users[i].is_admin === 'undefined' ? false : data.users[i].is_admin
              data.users[i].is_updating = false
            }
            this.users = data.users
          } else {
            this.users = []
          }
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: 'Fail to fetch user list',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    enter (order) {
      this.$router.push({ name: 'manageUserView', params: { userID: this.users[order].id } })
    },
    changeAdmin (order) {
      this.users[order].is_updating = true
      if (this.users[order].is_admin) {
        admin.add([this.users[order].id])
          .then(({data}) => {
            if (data.details[0].status === this.$const.status.SUCCESS) {
              this.$buefy.toast.open({
                message: `Successfully set ${this.users[order].username} as admin`,
                type: 'is-success'
              })
            } else {
              this.$buefy.toast.open({
                message: `Error occurs when setting ${this.users[order].username} as admin. Message: ${data.details[0]}`,
                type: 'is-danger'
              })
            }
          })
          .catch(({response}) => {
            this.$buefy.toast.open({
              message: `Error occurs when setting ${this.users[order].username} as admin. Message: ${response.data.message}`,
              type: 'is-danger'
            })
          })
          .finally(() => {
            this.users[order].is_updating = false
          })
      } else {
        admin.delete([this.users[order].id])
          .then(({data}) => {
            if (data.details[0].status === this.$const.status.SUCCESS) {
              this.$buefy.toast.open({
                message: `Successfully remove ${this.users[order].username}'s admin role`,
                type: 'is-success'
              })
            } else {
              this.$buefy.toast.open({
                message: `Error occurs when removing ${this.users[order].username}'s admin role. Message: ${data.details[0]}`,
                type: 'is-danger'
              })
            }
          })
          .catch(({response}) => {
            this.$buefy.toast.open({
              message: `Error occurs when removing ${this.users[order].username}'s admin role. Message: ${response.data.message}`,
              type: 'is-danger'
            })
          })
          .finally(() => {
            this.users[order].is_updating = false
          })
      }
    },
    deleteUser (order) {
      this.users[order].is_updating = true
      user.deleteByID(this.users[order].id)
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully delete user ${this.users[order].username}`,
            type: 'is-success'
          })
          this.load()
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to delete user ${this.users[order].username}. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.users[order].is_updating = false
        })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.load()
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
