<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Add A Notification</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <b-field label="Content" label-position="on-border">
        <b-input v-model="content" size="is-medium" type="textarea"></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot" style="justify-content: flex-end">
      <button class="button" @click="$parent.close()" :disabled="isSubmitting">Cancel</button>
      <button class="button is-primary" @click="add" :disabled="isSubmitting">Create</button>
    </footer>
  </div>
</template>

<script>
import contest from '../../../../../api/contest'

export default {
  name: 'NotificationNew',
  data () {
    return {
      isSubmitting: false,
      content: ''
    }
  },
  methods: {
    add () {
      if (this.content === '') {
        this.$buefy.toast.open({
          message: 'Notification content cannot be empty',
          type: 'is-danger'
        })
        return
      }
      this.isSubmitting = true
      contest.addNotification(this.$route.params.contestID, this.content)
        .then(({data}) => {
          this.$buefy.toast.open({
            message: `Successfully added notification ${data.notification_order}`,
            type: 'is-success'
          })
          this.$parent.close()
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to add notification. Message: ${response.data.message}`,
            type: 'is-danger'
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
