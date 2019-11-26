<template>
  <section class="section" style="position: relative">
    <router-link :to="{ name: 'manageUserList', params: { userID: $route.params.userID } }">
      &lt; Back to User List
    </router-link>
    <template v-if="user === null">
      <div class="content has-text-gray has-text-centered">
        <p><b-icon icon="emoticon-sad" size="is-large"></b-icon></p>
        <p>No such user.</p>
      </div>
    </template>
    <template v-else>
      <div class="media" style="margin-bottom: 10px">
        <div class="media-left">
          <img class="avatar" :src="`https://www.gravatar.com/avatar/${user.email_hash}`" alt="avatar" width="80" height="80">
        </div>
        <div class="media-content" style="padding: 18px 0 0 10px;">
          <p class="title is-2" style="font-weight: normal">{{ user.username }}</p>
        </div>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">
          <b-menu>
            <b-menu-list label="Menu">
              <b-menu-item tag="router-link" :to="{ name: 'manageUserView' }" icon="account" label="Profile" :active="isProfile"></b-menu-item>
              <b-menu-item tag="router-link" :to="{ name: 'manageUserViewTeam' }" icon="account-multiple" label="Teams" :active="isTeam"></b-menu-item>
            </b-menu-list>
            <b-menu-list label="Actions">
              <b-menu-item v-if="isProfile" icon="check-circle-outline" label="Submit" @click="confirmSubmit" :disabled="isSubmitting || isLoading"></b-menu-item>
              <b-menu-item v-if="isProfile && !user.is_admin" icon="account-star" label="Set Admin" @click="setAdmin" :disabled="isSubmitting || isLoading"></b-menu-item>
              <b-menu-item v-if="isProfile && user.is_admin" icon="account-remove" label="Remove Admin" @click="removeAdmin" :disabled="isSubmitting || isLoading || isMe"></b-menu-item>
              <b-menu-item v-if="isProfile" icon="email" label="Edit Email" @click="isChangeEmailModalActive = true" :disabled="isSubmitting || isLoading"></b-menu-item>
              <b-menu-item v-if="isProfile" icon="key" label="Edit Password" @click="isChangePasswordModalActive = true" :disabled="isSubmitting || isLoading"></b-menu-item>
              <b-menu-item icon="delete-forever" label="Delete User" @click="confirmDelete" :disabled="isSubmitting || isLoading || isMe"></b-menu-item>
            </b-menu-list>
          </b-menu>
        </div>
        <div class="column">
          <div v-if="isProfile" style="position: relative">
            <div class="columns">
              <div class="column is-four-fifths-desktop is-full-tablet">
                <div class="settings-fields">
                  <b-field class="settings-field" label="Description" label-position="on-border">
                    <b-input type="textarea" size="is-medium" v-model="user.profile.description" :disabled="isSubmitting"></b-input>
                  </b-field>
                  <b-field class="settings-field" label="Page" label-position="on-border">
                    <b-input type="url" size="is-medium" v-model="user.profile.page" :disabled="isSubmitting"></b-input>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <router-view></router-view>
        </div>
      </div>
    </template>
    <b-modal
      :active.sync="isChangeEmailModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <change-email :currentEmail="email"></change-email>
    </b-modal>
    <b-modal
      :active.sync="isChangePasswordModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <change-password></change-password>
    </b-modal>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import ChangeEmail from './Components/ChangeEmail'
import ChangePassword from './Components/ChangePassword'
import { mapState } from 'vuex'
import admin from '../../../../api/admin'
import user from '../../../../api/user'
import { mapIsRoute } from '../../../../common'

export default {
  name: 'UserView',
  components: { ChangeEmail, ChangePassword },
  data () {
    return {
      isChangeEmailModalActive: false,
      isChangePasswordModalActive: false,
      isLoading: true,
      isSubmitting: false,
      user: null
    }
  },
  computed: {
    ...mapState({
      session: state => state.session.logged
    }),
    ...mapIsRoute({
      isProfile: 'manageUserView',
      isTeam: 'manageUserViewTeam'
    }),
    isMe () {
      return this.user === null ? false : this.user.id === this.session.user_id
    },
    email () {
      return this.user === null ? '' : this.user.email
    }
  },
  methods: {
    load () {
      this.isLoading = true
      user.getByID(this.$route.params.userID)
        .then(({data}) => {
          this.user = data.user
        })
        .catch(() => {
          this.user = null
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    setAdmin () {
      this.isSubmitting = true
      admin.add([this.user.id])
        .then(({data}) => {
          if (data.details[0].status === this.$const.status.SUCCESS) {
            this.$buefy.toast.open({
              message: `Successfully set ${this.user.username} as admin`,
              type: 'is-success'
            })
            this.load()
          } else {
            this.$buefy.toast.open({
              message: `Error occurs when setting ${this.user.username} as admin. Message: ${data.details[0]}`,
              type: 'is-danger'
            })
          }
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Error occurs when setting ${this.user.username} as admin. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    removeAdmin () {
      this.isSubmitting = true
      admin.delete([this.user.id])
        .then(({data}) => {
          if (data.details[0].status === this.$const.status.SUCCESS) {
            this.$buefy.toast.open({
              message: `Successfully remove ${this.user.username}'s admin`,
              type: 'is-success'
            })
            this.load()
          } else {
            this.$buefy.toast.open({
              message: `Error occurs when removing ${this.user.username}'s admin. Message: ${data.details[0]}`,
              type: 'is-danger'
            })
          }
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Error occurs when removing ${this.user.username}'s admin. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    submit () {
      this.isSubmitting = true
      user.modifyProfileByID(this.user.id, {
        description: this.user.profile.description,
        page: this.user.profile.page
      })
        .then(() => {
          this.$buefy.dialog.alert('Successfully updated profile!')
        })
        .catch(({response}) => {
          this.$buefy.dialog.alert(`Failed to update profile. Message: ${response.data.message}`)
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    confirmSubmit () {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to submit the changes?',
        onConfirm: () => this.submit()
      })
    },
    delete () {
      this.isSubmitting = true
      user.deleteByID(this.user.id)
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully delete user ${this.user.username}`,
            type: 'is-success'
          })
          this.$router.push({ name: 'manageUserList' })
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to delete user ${this.user.username}. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    confirmDelete () {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to delete this user?',
        onConfirm: () => this.delete()
      })
    }
  },
  watch: {
    $route (to, from) {
      if (to.params.userID !== from.params.userID) {
        this.load()
      }
    },
    isChangeEmailModalActive (to, from) {
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
.settings-fields>.settings-field {
  margin-bottom: 20px;
}
.settings-fields>.settings-field:last-child {
  margin-bottom: 0;
}
</style>
