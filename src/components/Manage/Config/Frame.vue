<template>
  <section class="section">
    <div class="title-body">
      <h1 class="title">
        Configures
      </h1>
    </div>
    <div class="columns">
      <div class="column is-one-quarter">
        <b-menu>
          <b-menu-list label="Sections">
            <b-menu-item icon="settings" label="System" tag="router-link" :to="{ name: 'manageConfigSystem' }" :active="isSystem"></b-menu-item>
            <b-menu-item icon="account" label="User" tag="router-link" :to="{ name: 'manageConfigUser' }" :active="isUser"></b-menu-item>
          </b-menu-list>
          <b-menu-list label="Actions">
            <b-menu-item icon="check-circle-outline" label="Submit" @click="confirmSubmit" :disabled="isSubmitting"></b-menu-item>
            <b-menu-item icon="close-circle-outline" label="Restore" @click="confirmRestore" :disabled="isSubmitting"></b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
      <div class="column">
        <template v-if="isIndex">
          <p class="title is-4">Welcome to configures. Please select one of sections on the left.</p>
        </template>
        <router-view></router-view>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ConfigFrame',
  data () {
    return {
      isSubmitting: false
    }
  },
  computed: {
    isIndex () {
      return this.$route.name === 'manageConfig'
    },
    isSystem () {
      return this.$route.name === 'manageConfigSystem'
    },
    isUser () {
      return this.$route.name === 'manageConfigUser'
    }
  },
  methods: {
    confirmSubmit () {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to submit the changes?',
        onConfirm: () => this.submit()
      })
    },
    confirmRestore () {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to restore the changes?',
        onConfirm: () => this.restore()
      })
    },
    submit () {
      this.isSubmitting = true
      this.$store.dispatch('config/update')
        .then((res) => {
          this.isSubmitting = false
          this.$buefy.dialog.alert('Successfully updated!')
        })
        .catch((err) => {
          this.isSubmitting = false
          this.$buefy.dialog.alert('Submit (Update) failed! Message: ' + err.response.data.message)
        })
    },
    restore () {
      this.isSubmitting = true
      this.$store.dispatch('config/load')
        .then((res) => {
          this.isSubmitting = false
          this.$buefy.dialog.alert('Successfully restored!')
        })
        .catch((err) => {
          this.isSubmitting = false
          this.$buefy.dialog.alert('Restore failed! Message: ' + err.response.data.message)
        })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('config/load')
        .then((res) => {
          if (vm.$route.name === 'manageConfig') {
            vm.$router.push({ name: 'manageConfigSystem' })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    })
  }
}
</script>

<style scoped>
.title {
  font-family: Lato, sans-serif;
  font-weight: normal;
}
.title-body {
  margin-bottom: 30px;
}
</style>
