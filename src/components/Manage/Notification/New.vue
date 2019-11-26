<template>
  <section>
    <slot></slot>
    <button class="button is-primary" @click="isNotificationModalActive = true"><b-icon icon="plus"></b-icon><span>New</span></button>
    <b-modal :active.sync="isNotificationModalActive" :can-cancel="false" aria-role="dialog" has-modal-card>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">New Notification</p>
          <button class="delete" aria-label="close" @click="isNotificationModalActive = false"></button>
        </header>
        <section class="modal-card-body">
          <user-i-d-input maxtags="1" :selected.sync="userID"/>
          <br>
          <b-field label="Content" label-position="on-border">
            <b-input v-model="content" size="is-medium" type="textarea"></b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot" style="justify-content: flex-end">
          <button class="button" @click="isNotificationModalActive = false">Cancel</button>
          <button class="button is-primary" @click="create">Create</button>
        </footer>
      </div>
    </b-modal>
  </section>
</template>

<script>
import notification from '../../../api/notification'
import UserIDInput from '../Team/View/UserIDInput'
export default {
  name: 'NewNotification',
  components: {UserIDInput},
  data () {
    return {
      isNotificationModalActive: false,
      userID: new Set(),
      content: ''
    }
  },
  methods: {
    create () {
      if (this.userID.size === 0) {
        this.$buefy.toast.open({
          message: "UserID can't be empty",
          type: 'is-danger'
        })
        return
      }
      let id = Array.from(this.userID)[0]
      notification.create({
        user_id: id,
        content: this.content })
        .then(({data}) => {
          this.$buefy.toast.open({
            message: 'Successfully created notification',
            type: 'is-success'
          })
          this.clear()
          this.isNotificationModalActive = false
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: 'Something wrong happened when create new notification',
            type: 'is-danger'
          })
        })
    },
    clear () {
      this.userID = new Set()
      this.content = ''
    }
  },
  watch: {
    isNotificationModalActive (from, to) {
      if (to !== from) {
        this.clear()
      }
    }
  }
}
</script>

<style scoped>

</style>
