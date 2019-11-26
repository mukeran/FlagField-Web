<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Edit A Hint</p>
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
      <button class="button is-primary" @click="create" :disabled="isSubmitting">Modify</button>
    </footer>
  </div>
</template>

<script>
import problem from '../../../../../../../api/problem'

export default {
  name: 'HintNew',
  props: {
    hint: Object
  },
  data () {
    return {
      isSubmitting: false,
      cost: this.hint.cost,
      content: this.hint.content
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
      problem.modifyHint(this.$route.params.contestID, this.$route.params.problemAlias, this.hint.order, {
        cost: this.cost,
        content: this.content
      })
        .then(({data}) => {
          this.$buefy.toast.open({
            message: 'Successfully edited',
            type: 'is-success'
          })
          this.$parent.close()
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: 'Failed to edit hint. Message: ' + response.data.message,
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
