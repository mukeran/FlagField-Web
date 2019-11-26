<template>
  <div>
    <div class="settings-group">
      <div class="settings-header">
        <p class="title is-4">Time</p>
        <p class="subtitle is-7">Configure Contest Time Settings</p>
        <hr class="separator">
      </div>
      <div class="columns">
        <div class="column is-four-fifths-desktop is-full-tablet">
          <div class="settings-fields">
            <b-field class="settings-field" label="Start Time" label-position="on-border">
              <b-datetimepicker
                v-model="contest.start_time"
                size="is-medium"
                rounded
                placeholder="Click to select..."
                icon="calendar-today"
                :timepicker="{ enableSeconds: true }">
              </b-datetimepicker>
            </b-field>
            <b-field class="settings-field" label="End Time" label-position="on-border">
              <b-datetimepicker
                v-model="contest.end_time"
                size="is-medium"
                rounded
                placeholder="Click to select..."
                icon="calendar-today"
                :min-datetime="contest.start_time"
                :timepicker="{ enableSeconds: true }">
              </b-datetimepicker>
            </b-field>
          </div>
        </div>
      </div>
    </div>
    <div class="settings-group">
      <div class="settings-header">
        <p class="title is-4">Properties</p>
        <p class="subtitle is-7">Configure Contest Properties</p>
        <hr class="separator">
      </div>
      <div class="columns">
        <div class="column is-four-fifths-desktop is-full-tablet">
          <div class="settings-fields">
            <b-field class="settings-field" label="Access" label-position="on-border">
              <b-select v-model="contest.access" size="is-medium" expanded>
                <option value="0">Register</option>
                <option value="1">Private</option>
              </b-select>
            </b-field>
            <b-field class="settings-field">
              <div class="level is-mobile">
                <span class="level-left switch-label">Is Hidden</span>
                <b-switch class="level-right" size="is-medium" type="is-success" v-model="contest.is_hidden"></b-switch>
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
    contest: Object
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
