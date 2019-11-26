<template>
  <div style="display : inline-block">
    <button v-show="(showButton === true)" class="button is-primary" type="is-primary" @click="show"><b-icon icon="plus"></b-icon><span>Token</span></button>
    <slot></slot>
    <b-modal
      :active.sync="_isModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <div class="modal-card register-modal" style="min-height: 500px">
        <b-loading :is-full-page="false" :active.sync="isAdding"></b-loading>
        <header class="modal-card-head">
          <p class="modal-card-title">Join a team</p>
          <button class="delete" aria-label="close" @click="_isModalActive = false"></button>
        </header>
        <section class="modal-card-body">
          <team-i-d-input :maxtags="1" :loading="isAdding" :selected.sync="selectedTeams"/>
          <b-field  label="Token" label-position="on-border">
            <b-input type="text" required :loading="isAdding" v-model="token"></b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot" style="justify-content: flex-end">
          <button class="button" type="button" @click="_isModalActive = false" :disabled="isAdding">Close</button>
          <button class="button is-primary" @click="doAdd" :disabled="isAdding">Add</button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import team from '../../../../api/team'
import constants from '../../../../constants'
import TeamIDInput from '../../../Manage/Team/View/TeamIDInput'
export default {
  name: 'TokenModal',
  components: {TeamIDInput},
  props: {
    showButton: {
      type: Boolean,
      default: false
    },
    isModalActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _isModalActive: {
      get () {
        return this.isModalActive
      },
      set (value) {
        this.$emit('update:isModalActive', value)
        if (value === false) {
          this.clear()
        }
      }
    }
  },
  data () {
    return {
      selectedTeams: new Set(),
      token: '',
      isAdding: false
    }
  },
  methods: {
    doAdd () {
      if (this.selectedTeams.size !== 1) {
        this.$buefy.toast.open({
          message: `Please choose only one team`,
          type: 'is-danger'
        })
        return
      }
      if (this.token === '') {
        this.$buefy.toast.open({
          message: `Please input token`,
          type: 'is-danger'
        })
        return
      }
      this.isAdding = true
      Array.from(this.selectedTeams).forEach((value, key) => {
        team.acceptInvitationByToken(value, { token: this.token })
          .then(() => {
            this.$buefy.toast.open({
              message: `Added successfully!`,
              type: 'is-success'
            })
            this.$emit('updated')
            this._isModalActive = false
          })
          .catch((err) => {
            if (typeof err.response.data.status !== 'undefined') {
              if (err.response.data.status === constants.status.ALREADY_JOINED_IN_TEAM) {
                this.$buefy.toast.open({
                  message: `Already in team !`,
                  type: 'is-danger'
                })
                return
              } else if (err.response.data.status === constants.status.INVALID_INVITATION_TOKEN) {
                this.$buefy.toast.open({
                  message: `Wrong Token!`,
                  type: 'is-danger'
                })
                return
              }
            }
            this.$store.dispatch('session/informConnectionError', err)
          })
          .finally(() => {
            this.isAdding = false
            this.clear()
          })
      })
    },
    show () {
      this._isModalActive = true
      this.clear()
    },
    clear () {
      this.selectedTeams = new Set()
      this.token = ''
    }
  }
}
</script>

<style scoped>

</style>
