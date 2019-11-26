<template>
  <div>
    <b-field label="Users" label-position="on-border">
      <b-taginput
        :maxtags="maxtags"
        v-model="users"
        :data="filteredUsers"
        autocomplete
        field="username"
        size="is-medium"
        :loading="isFetchingUsers || loading === true"
        :before-adding="teamCheckUser"
        @add="teamAddUser"
        @remove="teamRemoveUser"
        :open-on-focus="true"
        placeholder="Type username to select"
        @focus="() => {teamGetUsers('')}"
        @typing="teamGetUsers">
        <template slot-scope="props">
          <div class="media">
            <div class="media-left">
              <img :src="`https://cn.gravatar.com/avatar/${props.option.email_hash}`" height="40" width="40" :alt="`${props.option.username}'s avatar`">
            </div>
            <div class="media-content">
              {{ props.option.id }} | {{ props.option.username }}
            </div>
          </div>
        </template>
        <template slot="empty">
          Not found
        </template>
      </b-taginput>
    </b-field>
  </div>
</template>

<script>
import debounce from 'debounce'
import user from '../../../../api/user'
export default {
  name: 'UserIDInput',
  props: ['loading', 'selected', 'maxtags'],
  data () {
    return {
      isFetchingUsers: false,
      users: [],
      selectedUsers: this.selected || new Set(),
      filteredUsers: []
    }
  },
  methods: {
    teamCheckUser (user) {
      if (this.selectedUsers.has(user.id)) {
        this.$buefy.toast.open({
          message: 'You have selected this user!',
          type: 'is-danger'
        })
        return false
      }
      return true
    },
    teamAddUser (user) {
      this.selectedUsers.add(user.id)
      this.$emit('update:selected', this.selectedUsers)
    },
    teamRemoveUser (user) {
      this.selectedUsers.delete(user.id)
      this.$emit('update:selected', this.selectedUsers)
    },
    teamGetUsers: debounce(function (text) {
      this.isFetchingUsers = true
      user.list()
        .then((res) => {
          this.filteredUsers = (res.data.users || []).filter((option) => {
            return option.username
              .toString()
              .toLowerCase()
              .indexOf(text.toLowerCase()) >= 0
          })
          this.$emit('update:selected', this.selectedUsers)
        })
        .catch((err) => {
          this.filteredUsers = []
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          this.isFetchingUsers = false
        })
    }, 100),
    clear () {
      this.users = []
      this.selectedUsers = new Set()
      this.$emit('update:selected', this.selectedUsers)
    }
  }
}
</script>

<style scoped>

</style>
