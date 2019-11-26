<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Add A Hint</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <b-field label="Cost" label-position="on-border">
        <b-numberinput v-model="cost" size="is-medium"></b-numberinput>
      </b-field>
      <b-field label="Content" label-position="on-border">
        <b-input v-model="content" size="is-medium" type="textarea" placeholder="Plain text to hint"></b-input>
      </b-field>
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
  name: 'HintNew',
  data () {
    return {
      isSubmitting: false,
      cost: 0,
      content: ''
    }
  },
  methods: {
    create () {
      if (this.content === '') {
        this.$buefy.toast.open({
          message: 'Content cannot be empty',
          type: 'is-danger'
        })
        return
      }
      this.isSubmitting = true
      problem.newHint(this.$route.params.contestID, this.$route.params.problemAlias, {
        cost: this.cost,
        content: this.content
      })
        .then(({data}) => {
          this.$buefy.toast.open({
            message: 'Successfully created hint ' + data.hint_order,
            type: 'is-success'
          })
          this.$parent.close()
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: 'Failed to create hint. Message: ' + response.data.message,
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
