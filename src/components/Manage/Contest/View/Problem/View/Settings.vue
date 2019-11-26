<template>
  <div>
    <div class="settings-group">
      <div class="settings-header">
        <p class="title is-4">Properties</p>
        <p class="subtitle is-7">Configure General Problem Settings</p>
        <hr class="separator">
      </div>
      <div class="columns">
        <div class="column is-four-fifths-desktop is-full-tablet">
          <div class="settings-fields">
            <b-field class="settings-field" label="Points" label-position="on-border">
              <b-numberinput v-model="problem.points" size="is-medium"></b-numberinput>
            </b-field>
            <b-field class="settings-field" label="Type" label-position="on-border">
              <b-input v-model="problem.type" size="is-medium" placeholder="Problem's type. e.g. web, pwn, etc."></b-input>
            </b-field>
            <b-field class="settings-field">
              <div class="level is-mobile">
                <span class="level-left switch-label">Is Hidden</span>
                <b-switch class="level-right" size="is-medium" type="is-success" v-model="problem.is_hidden"></b-switch>
              </div>
            </b-field>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  props: {
    problem: Object
  }
}
</script>

<style>
  .settings-group:not(:first-child) {
    margin-top: 20px
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
  }
  .settings-fields>.settings-field {
    margin-bottom: 20px;
  }
  .settings-fields>.settings-field:last-child {
    margin-bottom: 0;
  }
  .switch-label {
    font-size: 1.1rem;
    font-family: Lato, sans-serif;
    font-weight: normal;
  }
</style>
