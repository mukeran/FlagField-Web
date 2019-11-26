<template>
  <div style="display: inline-block">
    <slot></slot>
    <button v-show="(showButton === true)" class="button is-primary" type="is-primary" @click="isTeamModalActive = true"><b-icon icon="plus"></b-icon><span>New</span></button>
    <b-modal :active.sync="isTeamModalActive" :can-cancel="false" aria-role="dialog" has-modal-card>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Create A New Team</p>
          <button class="delete" aria-label="close" @click="isTeamModalActive = false"></button>
        </header>
        <section class="modal-card-body">
          <b-field label="Name" label-position="on-border">
            <b-input v-model="name" size="is-medium"></b-input>
          </b-field>
          <b-field label="Description" label-position="on-border">
            <b-input v-model="description" size="is-medium" type="textarea"></b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot" style="justify-content: flex-end">
          <button class="button" @click="isTeamModalActive = false">Cancel</button>
          <button class="button is-primary" @click="create">Create</button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
import team from '../../../api/team'
export default {
  name: 'NewTeamModal',
  props: {
    admin: {
      type: Boolean,
      default: false
    },
    showButton: {
      type: Boolean,
      default: true
    },
    isModalActive: {
      type: Boolean,
      default: false
    }
  }, // determines where to nevigate to
  data () {
    return {
      name: '',
      description: ''
    }
  },
  computed: {
    isTeamModalActive: {
      get () {
        return this.isModalActive
      },
      set (value) {
        this.$emit('update:isModalActive', value)
      }
    }
  },
  methods: {
    create () {
      if (this.name === '') {
        this.$buefy.toast.open({
          message: 'Contest name cannot be empty',
          type: 'is-danger'
        })
        return
      }
      team.create({
        name: this.name,
        description: this.description })
        .then(({data}) => {
          this.$buefy.toast.open({
            message: 'Successfully created contest',
            type: 'is-success'
          })
          this.isModalActive = false
          if (this.admin === true) {
            this.$router.push({ name: 'manageTeamView', params: { teamID: data.team_id } })
          } else {
            this.$router.push({ name: 'teamManage', params: { teamID: data.team_id } })
          }
        })
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => { this.clear() })
    },
    clear () {
      this.name = ''
      this.description = ''
    }
  },
  watch: {
  }
}
</script>

<style scoped>

</style>
