<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Add A Flag</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <b-field label="Type" label-position="on-border">
        <b-select v-model="type" size="is-medium" placeholder="Select a flag type" expanded>
          <option value="static">Static - Static string</option>
        </b-select>
      </b-field>
      <template v-if="type === `static`">
        <b-field label="Flag" label-position="on-border">
          <b-input v-model="settings.flag" size="is-medium" placeholder="Flag string" @keyup.enter.native="create"></b-input>
        </b-field>
      </template>
    </section>
    <footer class="modal-card-foot" style="justify-content: flex-end">
      <button class="button" @click="$parent.close()" :disabled="isSubmitting">Cancel</button>
      <button class="button is-primary" @click="create" :disabled="isSubmitting">Create</button>
    </footer>
  </div>
</template>

<script>
import problem from '../../../../../../../api/problem'

export default {
  name: 'FlagNew',
  data () {
    return {
      isSubmitting: false,
      type: 'static',
      settings: {
        flag: ''
      }
    }
  },
  methods: {
    create () {
      if (this.type === 'static' && (typeof this.settings.flag === 'undefined' || this.settings.flag === '')) {
        this.$buefy.toast.open({
          message: 'Flag string cannot be empty',
          type: 'is-danger'
        })
        return
      }
      this.isSubmitting = true
      problem.newFlag(this.$route.params.contestID, this.$route.params.problemAlias, {
        type: this.type,
        settings: this.settings
      })
        .then(({data}) => {
          this.$buefy.toast.open({
            message: 'Successfully created flag ' + data.flag_order,
            type: 'is-success'
          })
          this.$parent.close()
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: 'Failed to create flag. Message: ' + response.data.message,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isSubmitting = false
        })
    }
  },
  watch: {
    type (to, from) {
      if (to === 'static') {
        this.settings = {
          flag: ''
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
