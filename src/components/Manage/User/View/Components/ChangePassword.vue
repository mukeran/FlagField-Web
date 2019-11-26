<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Change Password</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <b-field label="New Password" label-position="on-border">
        <b-input type="password" size="is-medium" v-model="newPassword" :disabled="isSubmitting" :password-reveal="true" @keyup.enter.native="change"></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot" style="justify-content: flex-end">
      <button class="button" @click="$parent.close()" :disabled="isSubmitting">Cancel</button>
      <button class="button is-primary" @click="change" :disabled="isSubmitting">Change</button>
    </footer>
  </div>
</template>

<script>
import user from '../../../../../api/user'

export default {
  name: 'ChangePassword',
  data () {
    return {
      isSubmitting: false,
      newPassword: ''
    }
  },
  methods: {
    change () {
      if (this.newPassword.length < 6) {
        this.$buefy.toast.open({
          message: `Password has to be more than 6 characters`,
          type: 'is-danger'
        })
        return
      }
      this.isSubmitting = true
      user.modifyPasswordByID(this.$route.params.userID, {
        new_password: this.newPassword
      })
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully edited password`,
            type: 'is-success'
          })
          this.$parent.close()
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to change password. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isSubmitting = false
        })
    }
  }
}
</script>

<style scoped>

</style>
