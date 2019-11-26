<template>
  <div>
    <div class="settings-group">
      <div class="settings-header">
        <p class="title is-4">Delete My Account</p>
        <p class="subtitle is-7">Dangerous!</p>
        <hr class="separator">
      </div>
      <div class="columns">
        <div class="column is-four-fifths-desktop is-full-tablet settings-content">
          <p class="settings-content-item">Please think carefully before you execute.</p>
          <p class="settings-content-item">You will be unable to log in your account and your data will be cleaned.</p>
          <b-button type="is-danger" class="settings-content-item" @click="isDeleteAccountModalActive = true">Delete My Account</b-button>
        </div>
      </div>
    </div>
    <b-modal
      :active.sync="isDeleteAccountModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <delete-account></delete-account>
    </b-modal>
  </div>
</template>

<script>
import DeleteAccount from './Components/DeleteAccount'

export default {
  name: 'DangerZone',
  components: { DeleteAccount },
  data () {
    return {
      isDeleteAccountModalActive: false
    }
  }
}
</script>

<style scoped>
.settings-group:not(:first-child) {
  margin-top: 40px
}
.settings-header>.title {
  font-family: Lato, sans-serif;
  font-weight: normal;
}
.settings-header>.subtitle {
  margin-bottom: 0;
}
.settings-header>.separator {
  margin-top: 10px;
  margin-bottom: 15px;
}
.settings-content>.settings-content-item:not(:last-child) {
  margin-bottom: 5px;
}
</style>
