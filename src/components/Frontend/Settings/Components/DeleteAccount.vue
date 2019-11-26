<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Change Password</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <p class="item">Are you sure to delete your account? Input your username to continue:</p>
      <b-field class="item" label="Username" label-position="on-border">
        <b-input type="text" size="is-medium" v-model="username" :disabled="isDeleting"></b-input>
      </b-field>
      <b-button class="item" type="is-danger" size="is-medium" @click="deleteAccount" :disabled="!isEqual || isDeleting" expanded>Delete My Account</b-button>
      <b-button class="item" size="is-medium" @click="$parent.close()" :disabled="isDeleting" expanded>Cancel</b-button>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import user from '../../../../api/user'

export default {
  name: 'DeleteAccount',
  data () {
    return {
      isDeleting: false,
      username: ''
    }
  },
  computed: {
    ...mapState({
      session: state => state.session.logged
    }),
    isEqual () {
      return this.username === this.session.username
    }
  },
  methods: {
    deleteAccount () {
      this.isDeleting = true
      user.deleteByID(this.session.user_id)
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully deleted your account`,
            type: 'is-success'
          })
          this.$router.push('/')
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to delete your account. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isDeleting = false
        })
    }
  }
}
</script>

<style scoped>
.modal-card-body>.item:not(:last-child) {
  margin-bottom: 10px;
}
</style>
