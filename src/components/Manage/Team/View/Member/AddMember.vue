<template>
  <div>
    <button v-show="(showButton === true)" class="button is-primary" type="is-primary" @click="show"><b-icon icon="plus"></b-icon><span>Add</span></button>
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
          <p class="modal-card-title">Add a member</p>
          <button class="delete" aria-label="close" @click="$emit('update:isModalActive', false)"></button>
        </header>
        <section class="modal-card-body">
          <user-i-d-input :loading="isAdding" :selected.sync="selected"/>
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
  name: 'AddMemberModal',
  components: {UserIDInput},
  props: ['teamID', 'isModalActive', 'showButton'],
  data () {
    return {
      selected: new Set(),
      isAdding: false
    }
  },
  methods: {
    doAdd () {
      if (this.selected.size === 0) {
        this.$buefy.toast.open({
          message: `Please choose at least a member`,
          type: 'is-danger'
        })
        return
      }
      this.isAdding = true
      team.addMemberByID(this.teamID, { users_id: Array.from(this.selected) })
        .then(() => {
          this.$buefy.toast.open({
            message: `Added successfully!`,
            type: 'is-success'
          })
          this.$emit('updated')
          this.$emit('update:isModalActive', false)
          // this.isModalActive = false
          this.clear()
        })
        .catch((err) => {
          if (typeof err.response.data.status !== 'undefined') {
            if (err.response.data.status === constants.status.ALREADY_JOINED_IN_TEAM) {
              this.$buefy.toast.open({
                message: `User already in team !`,
                type: 'is-danger'
              })
              return
            }
          }
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          this.isAdding = false
        })
    },
    show () {
      this.$emit('update:isModalActive', true)
      // this.isModalActive = true
      this.selected = new Set()
    },
    clear () {
      this.selected = new Set()
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
