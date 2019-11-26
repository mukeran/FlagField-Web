<template>
  <div style="position: relative">
    <div class="settings-group">
      <div class="columns">
        <div class="column is-four-fifths-desktop is-full-tablet">
          <div class="settings-fields">
            <b-field class="settings-field" label="Avatar">
              <template v-if="isLoading">Loading... <b-icon icon="loading" custom-class="mdi-spin"></b-icon></template>
              <template v-else>
                <div class="level">
                  <div class="level-left">
                    <img :src="`https://www.gravatar.com/avatar/${emailHash}`" alt="your gravatar" width="80" height="80">
                  </div>
                  <div class="level-right">
                    <a href="https://www.gravatar.com">Want to change? Click here to register at gravatar.</a>
                  </div>
                </div>
              </template>
            </b-field>
            <b-field class="settings-field" label="Description" label-position="on-border">
              <b-input type="textarea" size="is-medium" v-model="description" :disabled="isSubmitting"></b-input>
            </b-field>
            <b-field class="settings-field" label="Page" label-position="on-border">
              <b-input type="url" size="is-medium" v-model="page" :disabled="isSubmitting"></b-input>
            </b-field>
          </div>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import user from '../../../api/user'

export default {
  name: 'Profile',
  props: {
    isSubmitting: Boolean
  },
  data () {
    return {
      isLoading: true,
      description: '',
      page: '',
      emailHash: ''
    }
  },
  computed: {
    ...mapState({
      session: state => state.session.logged
    }),
    _isSubmitting: {
      get () {
        return this.isSubmitting
      },
      set (value) {
        this.$emit('on-is-submitting-changed', value)
      }
    }
  },
  methods: {
    load () {
      this.isLoading = true
      user.getByID(this.session.user_id)
        .then(({data}) => {
          this.description = data.user.profile.description
          this.page = data.user.profile.page
          this.emailHash = data.user.email_hash
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to fetch profile. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    submit () {
      this._isSubmitting = true
      user.modifyProfileByID(this.session.user_id, {
        description: this.description,
        page: this.page
      })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Successfully modified profile',
            type: 'is-success'
          })
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to modify profile. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this._isSubmitting = false
        })
    },
    confirmSubmit () {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to submit the changes?',
        onConfirm: () => this.submit()
      })
    }
  },
  mounted () {
    this.$on('submit', () => {
      this.confirmSubmit()
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.load()
    })
  }
}
</script>

<style scoped>
.settings-fields>.settings-field {
  margin-bottom: 20px;
}
.settings-fields>.settings-field:last-child {
  margin-bottom: 0;
}
</style>
