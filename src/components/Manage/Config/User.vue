<template>
  <div>
    <div class="settings-group">
      <div class="settings-header">
        <p class="title is-4">Register</p>
        <p class="subtitle is-7">Settings about user registration</p>
        <hr class="separator">
      </div>
      <div class="columns">
        <div class="column is-four-fifths-desktop is-full-tablet">
          <div class="settings-fields">
            <div class="settings-field">
              <div class="level is-mobile">
                <span class="level-left switch-label">Email Validation</span>
                <b-switch class="level-right" size="is-medium" type="is-success" v-model="registerEnableEmailCaptcha"></b-switch>
              </div>
            </div>
            <div class="settings-field">
              <div class="level is-mobile">
                <span class="level-left switch-label">Email Whitelist</span>
                <b-switch class="level-right" size="is-medium" type="is-success" v-model="registerEnableEmailWhitelist"></b-switch>
              </div>
            </div>
            <b-field class="settings-field" label="Email Whitelist" label-position="on-border">
              <b-input size="is-medium" v-model="registerEmailWhitelist" :disabled="!registerEnableEmailWhitelist"></b-input>
            </b-field>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapConfig, mapConfigSwitch } from './common'

export default {
  name: 'User',
  computed: {
    ...mapConfig({
      registerEmailWhitelist: 'user.register.emailWhitelist'
    }),
    ...mapConfigSwitch({
      registerEnableEmailCaptcha: 'user.register.enableEmailCaptcha',
      registerEnableEmailWhitelist: 'user.register.enableEmailWhitelist'
    })
  }
}
</script>

<style scoped>
@import "common.css";
</style>
