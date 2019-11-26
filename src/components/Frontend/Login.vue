<template>
  <section class="section">
    <div class="columns">
      <div class="column is-one-third is-offset-one-third">
        <section class="section">
          <h1 class="title is-center" id="login-title">Log in</h1>
        </section>
        <section class="section" :style="{ paddingLeft: 0, paddingRight: 0 }" v-show="hasError">
          <b-message
            type="is-danger"
            has-icon>
            {{ errorMessage }}
          </b-message>
        </section>
        <b-field label="Username" label-position="inside">
          <b-input
          ref="usernameInput"
          type="text"
          minlength="1"
          maxlength="20"
          required
          v-model="username"
          :disabled="isLoggingIn">
          </b-input>
        </b-field>
        <b-field label="Password" label-position="inside">
          <b-input
          ref="passwordInput"
          type="password"
          required
          @keyup.enter.native="login"
          v-model="password"
          :disabled="isLoggingIn"></b-input>
        </b-field>
        <b-field :style="{ marginTop: '25px' }">
          <b-button
          type="is-primary"
          :style="{ width: '100%' }"
          size="is-medium"
          @click="login"
          outlined
          :loading="isLoggingIn">Login</b-button>
        </b-field>
        <b-field :style="{ marginTop: '25px' }">
          <router-link :to="{ name: 'register', query: { path: $route.query.path } }" :style="{ float: 'right' }">Don't have an account? click here</router-link>
        </b-field>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      password: '',
      isLoggingIn: false,
      hasError: false,
      errorMessage: ''
    }
  },
  methods: {
    validate () {
      return !(!this.$refs.usernameInput.checkHtml5Validity() | !this.$refs.passwordInput.checkHtml5Validity())
    },
    redirectPath () {
      if (typeof (this.$route.query.path) === 'undefined') {
        this.$router.push('/')
      } else {
        this.$router.push(this.$route.query.path)
      }
    },
    login () {
      if (!this.validate()) {
        return
      }
      this.hasError = false
      this.isLoggingIn = true
      this.$store.dispatch('session/login', { username: this.username, password: this.password })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Successfully logged in. Redirecting...',
            type: 'is-success'
          })
          this.redirectPath()
        })
        .catch((err) => {
          let res = err.response
          this.$buefy.toast.open({
            message: 'Something wrong with the information you provided.',
            type: 'is-danger'
          })
          this.isLoggingIn = false
          this.hasError = true
          this.errorMessage = (res.data.message || res.data)
        })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.isLoggingIn = false
      if (vm.$store.state.session.isLoggedIn) {
        vm.redirectPath()
      }
    })
  }
}
</script>

<style scoped>
#login-title{
  text-align: center;
  font-weight: lighter;
}
</style>
