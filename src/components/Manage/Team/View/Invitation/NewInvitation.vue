<template>
  <div>
    <button v-show="(showButton === true)" class="button is-primary" type="is-primary" @click="show"><b-icon icon="plus"></b-icon><span>New</span></button>
    <slot></slot>
    <b-modal
      :active.sync="isModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <div class="modal-card register-modal" style="min-height: 500px">
        <b-loading :is-full-page="false" :active.sync="isAdding"></b-loading>
        <header class="modal-card-head">
          <p class="modal-card-title">Send an invitation</p>
          <button class="delete" aria-label="close" @click="$emit('update:isModalActive', false)"></button>
        </header>
        <section class="modal-card-body">
          <user-i-d-input :maxtags="1" :loading="isAdding" :selected.sync="selectedUsers"/>
        </section>
        <footer class="modal-card-foot" style="justify-content: flex-end">
          <button class="button" type="button" @click="$emit('update:isModalActive', false)" :disabled="isAdding">Close</button>
          <button class="button is-primary" @click="doAdd" :disabled="isAdding">Add</button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import team from '../../../../../api/team'
import UserIDInput from '../UserIDInput'
import constants from '../../../../../constants'
export default {
  name: 'NewInvitationModal',
  components: {UserIDInput},
  props: ['teamID', 'isModalActive', 'showButton'],
  data () {
    return {
      selectedUsers: new Set(),
      isAdding: false
    }
  },
  methods: {
    doAdd () {
      if (this.selectedUsers.size !== 1) {
        this.$buefy.toast.open({
          message: `Please choose only one user`,
          type: 'is-danger'
        })
        return
      }
      this.isAdding = true
      Array.from(this.selectedUsers).forEach((value, key) => {
        team.sendInvitationByID(this.teamID, { user_id: value })
          .then(() => {
            this.$buefy.toast.open({
              message: `Sended successfully!`,
              type: 'is-success'
            })
            this.$emit('updated')
            this.$emit('update:isModalActive', false)
            this.clear()
          })
          .catch((err) => {
            if (typeof err.response.data.status !== 'undefined') {
              if (err.response.data.status === constants.status.ALREADY_JOINED_IN_TEAM) {
                this.$buefy.toast.open({
                  message: `Already in team !`,
                  type: 'is-danger'
                })
                return
              }
            }
            this.$store.dispatch('session/informConnectionError', err)
          })
          .finally(() => {
            this.isAdding = false
            this.$emit('updated')
          })
      })
    },
    show () {
      this.$emit('update:isModalActive', true)
      this.selectedUsers = new Set()
    }
  },
  watch: {
    isModalActive (from, to) {
      this.selectedUsers = new Set()
    }
  }
}
</script>

<style scoped>

</style>
