<template>
  <div style="display : inline-block">
    <button v-show="(showButton === true)" class="button is-primary" type="is-primary" @click="show"><b-icon icon="plus"></b-icon><span>Apply</span></button>
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
import TeamIDInput from '../../../Manage/Team/View/TeamIDInput'
import constants from '../../../../constants'
export default {
  name: 'NewApplicationModal',
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
  data () {
    return {
      selectedTeams: new Set(),
      isAdding: false
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
  methods: {
    doAdd () {
      if (this.selectedTeams.size !== 1) {
        this.$buefy.toast.open({
          message: `Please choose only one team`,
          type: 'is-danger'
        })
        return
      }
      this.isAdding = true

      // console.log(this.selectedTeams)
      Array.from(this.selectedTeams).forEach((value, key) => {
        team.sendApplicationByID(value)
          .then(() => {
            this.$buefy.toast.open({
              message: `Sended successfully!`,
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
              }
            }
            this.$store.dispatch('session/informConnectionError', err)
          })
          .finally(() => {
            this.isAdding = false
          })
      })
    },
    show () {
      this._isModalActive = true
      this.selectedTeams = new Set()
    },
    clear () {
      this.selectedTeams = new Set()
    }
  }
}
</script>

<style scoped>

</style>
