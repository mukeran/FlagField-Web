<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Change Email</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <p style="margin: 10px 0">Current Email: <b-tag>{{ currentEmail }}</b-tag></p>
      <b-field label="Email" label-position="on-border">
        <b-input type="text" size="is-medium" v-model="email" :disabled="isSubmitting" @keyup.enter.native="change" email></b-input>
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
  name: 'ChangeEmail',
  props: {
    currentEmail: String
  },
  data () {
    return {
      isSubmitting: false,
      email: ''
    }
  },
  methods: {
    change () {
      this.isSubmitting = true
      user.modifyEmailByID(this.$route.params.userID, {
        email: this.email
      })
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully changed email`,
            type: 'is-success'
          })
          this.$parent.close()
        })
        .catch(({response}) => {
          if (typeof response.data.status !== 'undefined' && response.data.status === this.$const.status.DUPLICATED_EMAIL) {
            this.$buefy.toast.open({
              message: `This email has been used`,
              type: 'is-danger'
            })
          } else {
            this.$buefy.toast.open({
              message: `Failed to change email. Message: ${response.data.message}`,
              type: 'is-danger'
            })
          }
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
