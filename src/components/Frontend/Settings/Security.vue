<template>
  <div>
    <div class="settings-group">
      <div class="settings-header">
        <p class="title is-4">Email</p>
        <p class="subtitle is-7">Change Email</p>
        <hr class="separator">
      </div>
      <div class="columns">
        <div class="column is-four-fifths-desktop is-full-tablet settings-content">
          <p class="settings-content-item">Changing your email into a new one requires a captcha sending to your new email.</p>
          <p class="settings-content-item">You will be unable to find your password by your old email.</p>
          <b-button type="is-danger" class="settings-content-item" @click="isChangeEmailModalActive = true" outlined>Change Email</b-button>
        </div>
      </div>
    </div>
    <div class="settings-group">
      <div class="settings-header">
        <p class="title is-4">Password</p>
        <p class="subtitle is-7">Change Password</p>
        <hr class="separator">
      </div>
      <div class="columns">
        <div class="column is-four-fifths-desktop is-full-tablet settings-content">
          <b-button type="is-danger" class="settings-content-item" @click="isChangePasswordModalActive = true" outlined>Change Password</b-button>
        </div>
      </div>
    </div>
    <b-modal
      :active.sync="isChangeEmailModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <change-email></change-email>
    </b-modal>
    <b-modal
      :active.sync="isChangePasswordModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <change-password></change-password>
    </b-modal>
  </div>
</template>

<script>
import ChangeEmail from './Components/ChangeEmail'
import ChangePassword from './Components/ChangePassword'

export default {
  name: 'Security',
  components: { ChangeEmail, ChangePassword },
  data () {
    return {
      isChangeEmailModalActive: false,
      isChangePasswordModalActive: false
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
