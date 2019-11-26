<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Change Email</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <b-field label="Email" label-position="on-border">
        <b-input type="text" size="is-medium" v-model="email" :disabled="isSubmitting" email expanded></b-input>
        <p class="control">
          <button class="button is-primary is-medium" @click="requestEmailCaptcha" :disabled="isEmailCaptchaCoolingDown || isSubmitting">
            <template v-if="!isEmailCaptchaCoolingDown">Send Captcha</template>
            <template v-else>{{ countDown }}</template>
          </button>
        </p>
      </b-field>
    </section>
    <footer class="modal-card-foot" style="justify-content: flex-end">
      <button class="button" @click="$parent.close()" :disabled="isSubmitting">Cancel</button>
      <button class="button is-primary" @click="change" :disabled="isSubmitting">Change</button>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'ChangeEmail',
  data () {
    return {
      isSubmitting: false,
      isEmailCaptchaCoolingDown: false,
      email: '',
      countDown: 0
    }
  },
  methods: {
    requestEmailCaptcha () {
      this.$buefy.toast.open({
        message: `Sorry, we do not support this function yet.`,
        type: 'is-danger'
      })
    },
    change () {
      this.$buefy.toast.open({
        message: `Sorry, we do not support this function yet.`,
        type: 'is-danger'
      })
    }
  }
}
</script>

<style scoped>

</style>
