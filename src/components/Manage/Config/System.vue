<template>
  <div>
    <div class="settings-group">
      <div class="settings-header">
        <p class="title is-4">Mail</p>
        <p class="subtitle is-7">Configure SMTP settings</p>
        <hr class="separator">
      </div>
      <div class="columns">
        <div class="column is-four-fifths-desktop is-full-tablet">
          <div class="settings-fields">
            <div class="columns">
              <div class="column is-four-fifths">
                <b-field class="settings-field" label="Host" label-position="on-border">
                  <b-input size="is-medium" v-model="host"></b-input>
                </b-field>
              </div>
              <div class="column">
                <b-field class="settings-field" label="Port" label-position="on-border">
                  <b-input size="is-medium" maxlength="5" :has-counter="false" v-model="port"></b-input>
                </b-field>
              </div>
            </div>
            <b-field class="settings-field" label="Sender Name" label-position="on-border">
              <b-input size="is-medium" v-model="sender_name"></b-input>
            </b-field>
            <b-field class="settings-field" label="Address" label-position="on-border">
              <b-input size="is-medium" v-model="address"></b-input>
            </b-field>
            <b-field class="settings-field" label="Username" label-position="on-border">
              <b-input size="is-medium" v-model="username"></b-input>
            </b-field>
            <b-field class="settings-field" label="Password" label-position="on-border">
              <b-input type="password" size="is-medium" :password-reveal="true" v-model="password"></b-input>
            </b-field>
            <div class="settings-field">
              <div class="level is-mobile">
                <span class="level-left switch-label">Use TLS</span>
                <b-switch class="level-right" size="is-medium" type="is-success" v-model="use_tls"></b-switch>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

const mapMailConfig = () => {
  let computed = {}
  let list = ['host', 'port', 'sender_name', 'address', 'username', 'password', 'use_tls']
  for (let i in list) {
    let item = list[i]
    computed[item] = {
      get () {
        let mailConfig
        try {
          mailConfig = JSON.parse(this.$store.state.config.configs['system.mail'])
        } catch (e) {
          this.$store.commit('config/setConfig', { key: 'system.mail', value: '{"host": "", "port": 0, "sender_name": "", "address": "", "username": "", "password": ""}' })
          mailConfig = JSON.parse(this.$store.state.config.configs['system.mail'])
        }
        return mailConfig[item]
      },
      set (value) {
        let mailConfig = JSON.parse(this.$store.state.config.configs['system.mail'])
        if (item === 'port') {
          mailConfig[item] = parseInt(value)
        } else {
          mailConfig[item] = value
        }
        this.$store.commit('config/setConfig', { key: 'system.mail', value: JSON.stringify(mailConfig) })
      }
    }
  }
  return computed
}

export default {
  name: 'System',
  computed: {
    ...mapState({
      configs: state => state.config.configs
    }),
    ...mapMailConfig()
  }
}
</script>

<style scoped>
@import "common.css";
</style>
