<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit A Flag</p>
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
          <b-input v-model="settings.flag" size="is-medium" placeholder="Flag string" @keyup.enter.native="modify"></b-input>
        </b-field>
      </template>
    </section>
    <footer class="modal-card-foot" style="justify-content: flex-end">
      <button class="button" @click="$parent.close()" :disabled="isSubmitting">Cancel</button>
      <button class="button is-primary" @click="modify" :disabled="isSubmitting">Modify</button>
    </footer>
  </div>
</template>

<script>
import problem from '../../../../../../../api/problem'

export default {
  name: 'FlagEdit',
  props: {
    flag: Object
  },
  data () {
    return {
      isSubmitting: false,
      type: this.flag.type,
      settings: this.flag.settings
    }
  },
  methods: {
    modify () {
      if (this.type === 'static' && (typeof this.settings.flag === 'undefined' || this.settings.flag === '')) {
        this.$buefy.toast.open({
          message: 'Flag string cannot be empty',
          type: 'is-danger'
        })
        return
      }
      this.isSubmitting = true
      problem.modifyFlag(this.$route.params.contestID, this.$route.params.problemAlias, this.flag.order, {
        type: this.type,
        settings: this.settings
      })
        .then(() => {
          this.$buefy.toast.open({
            message: 'Successfully edited',
            type: 'is-success'
          })
          this.$parent.close()
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: 'Failed to edit flag. Message: ' + response.data.message,
            type: 'is-success'
          })
          console.log(response.data)
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
