<template>
  <section class="section">
    <div class="columns">
      <div class="column is-one-third is-offset-one-third">
        <section class="section">
          <h1 class="title is-center" id="login-title">Register</h1>
        </section>
        <section class="section" :style="{ paddingLeft: 0, paddingRight: 0 }" v-show="hasError">
          <b-message
            type="is-danger"
            has-icon>
            {{ errorMessage }}
          </b-message>
        </section>
        <b-field label="Email" label-position="inside">
          <b-input
            ref="emailInput"
            type="text"
            email
            expanded
            v-model="email"
            :disabled="isRegistering">
          </b-input>
          <p class="control">
            <button class="button is-primary" @click="requestEmailCaptcha" :disabled="isEmailCaptchaCoolingDown || isRegistering">
              <template v-if="!isEmailCaptchaCoolingDown">Send Captcha</template>
              <template v-else>{{ countDown }}</template>
            </button>
          </p>
        </b-field>
        <b-field label="Validation Code" label-position="inside" v-show="isEmailSent">
          <b-input
            ref="validationCodeInput"
            type="text"
            required
            v-model="emailCaptcha"
            :disabled="isRegistering">
          </b-input>
        </b-field>
        <b-field label="Username" label-position="inside">
          <b-input
            ref="usernameInput"
            type="text"
            required
            minlength="1"
            maxlength="20"
            v-model="username"
            :disabled="isRegistering">
          </b-input>
        </b-field>
        <b-field label="Password" label-position="inside">
          <b-input
            ref="passwordInput"
            type="password"
            required
            minlength="6"
            maxlength="50"
            v-model="password"
            :disabled="isRegistering"></b-input>
        </b-field>
        <b-field label="Repeat Password" label-position="inside">
          <b-input
            ref="repeatPasswordInput"
            type="password"
            required
            @keyup.enter.native="register"
            v-model="repeatPassword"
            :disabled="isRegistering"></b-input>
        </b-field>
        <b-field :style="{ marginTop: '25px' }">
          <b-button
            type="is-primary"
            :style="{ width: '100%' }"
            size="is-medium"
            @click="register"
            outlined
            :loading="isRegistering">Register</b-button>
        </b-field>
        <b-field :style="{ marginTop: '25px' }">
          <router-link :to="{ name: 'login', query: { path: $route.query.path } }" :style="{ float: 'right' }">Want to log in? Click here.</router-link>
        </b-field>
      </div>
    </div>
  </section>
</template>

<script>
import user from '../../api/user'
import captcha from '../../api/captcha'
import constants from '../../constants'
export default {
  name: 'Register',
  data () {
    return {
      username: '',
      password: '',
      repeatPassword: '',
      email: '',
      emailCaptcha: '',
      isRegistering: false,
      hasError: false,
      errorMessage: '',
      isEmailCaptchaCoolingDown: false,
      isEmailSent: false,
      countDown: 60
    }
  },
  methods: {
    checkEmail () {
      return RegExp(/(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/).test(this.email)
    },
    requestEmailCaptcha () {
      if (!this.isEmailCaptchaCoolingDown) {
        this.isEmailCaptchaCoolingDown = true
        this.countDown = 'Please wait...'
        if (!this.checkEmail()) {
          this.isEmailCaptchaCoolingDown = false
          this.$buefy.toast.open({
            message: 'Invalid email',
            type: 'is-danger'
          })
          return
        }
        captcha.email({
          email: this.email,
          for: 'userRegister'
        }).then((res) => {
          this.isEmailSent = true
          this.$buefy.toast.open({
            message: 'Successfully requested validation code',
            type: 'is-success'
          })
          this.countDown = 60
          let clock = window.setInterval(() => {
            this.countDown--
            if (this.countDown === 0) {
              this.isEmailCaptchaCoolingDown = false
              window.clearInterval(clock)
            }
          }, 1000)
        }).catch((err) => {
          this.isEmailCaptchaCoolingDown = false
          if (typeof err.response.data.status === 'undefined' || err.response.data.status === constants.status.SERVER_ERROR) {
            this.$store.dispatch('session/informConnectionError', err)
          } else if (err.response.data.status === constants.status.COOL_DOWN) {
            this.$buefy.toast.open({
              message: 'It hasn\'t been 60 seconds since your last email request',
              type: 'is-danger'
            })
          } else if (err.response.data.status === constants.status.DUPLICATED_EMAIL) {
            this.$buefy.toast.open({
              message: 'The email has been used',
              type: 'is-danger'
            })
          } else if (err.response.data.status === constants.status.NOT_IN_WHITELIST) {
            this.$buefy.toast.open({
              message: 'Your email address is not in the whitelist',
              type: 'is-danger'
            })
          } else if (err.response.data.status === constants.status.FAILED_TO_SEND_EMAIL) {
            this.$buefy.toast.open({
              message: 'Failed to send email, please try again',
              type: 'is-danger'
            })
          } else {
            console.log(err.response.data)
            this.$buefy.toast.open({
              message: 'Unknown error',
              type: 'is-danger'
            })
          }
        })
      }
    },
    validate () {
      return !(!this.$refs.emailInput.checkHtml5Validity() | !this.$refs.validationCodeInput.checkHtml5Validity() | !this.$refs.usernameInput.checkHtml5Validity() | !this.$refs.passwordInput.checkHtml5Validity() | !this.$refs.repeatPasswordInput.checkHtml5Validity())
    },
    redirectPath () {
      this.$router.push({ name: 'login', query: { path: this.$route.query.path } })
    },
    register () {
      if (!this.validate()) {
        return
      }
      if (this.password !== this.repeatPassword) {
        this.hasError = true
        this.errorMessage = 'Two passwords don\'t match!'
        return
      }
      this.hasError = false
      this.isRegistering = true
      user.create({ email: this.email, email_captcha: this.emailCaptcha, username: this.username, password: this.password })
        .then(() => {
          this.$buefy.toast.open({
            message: 'You are in. Redirecting to login place.',
            type: 'is-success'
          })
          this.redirectPath()
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: 'Something wrong with the information you provided.',
            type: 'is-danger'
          })
          this.hasError = true
          this.errorMessage = (response.data.message || response.data) // duplicate email etc.
        })
        .finally(() => {
          this.isRegistering = false
        })
    }
  }
}
</script>

<style scoped>
#login-title{
  text-align: center;
  font-weight: lighter;
}
</style>
