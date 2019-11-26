<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Create A New Contest</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <b-field label="Name" label-position="on-border">
        <b-input v-model="name" size="is-medium"></b-input>
      </b-field>
      <b-field label="Description" label-position="on-border">
        <b-input v-model="description" size="is-medium" type="textarea" placeholder="Markdown supported"></b-input>
      </b-field>
      <b-field label="Start Time" label-position="on-border">
        <b-datetimepicker
          v-model="startTime"
          size="is-medium"
          rounded
          placeholder="Click to select..."
          icon="calendar-today"
          :timepicker="{ enableSeconds: true }">
        </b-datetimepicker>
      </b-field>
      <b-field label="End Time" label-position="on-border">
        <b-datetimepicker
          v-model="endTime"
          size="is-medium"
          rounded
          placeholder="Click to select..."
          icon="calendar-today"
          :min-datetime="startTime"
          :timepicker="{ enableSeconds: true }">
        </b-datetimepicker>
      </b-field>
      <b-field label="Access" label-position="on-border">
        <b-select v-model="access" size="is-medium" expanded>
          <option value="0">Register</option>
          <option value="1">Private</option>
        </b-select>
      </b-field>
    </section>
    <footer class="modal-card-foot" style="justify-content: flex-end">
      <button class="button" @click="$parent.close()" :disabled="isSubmitting">Cancel</button>
      <button class="button is-primary" @click="create" :disabled="isSubmitting">Create</button>
    </footer>
  </div>
</template>

<script>
import contest from '../../../api/contest'

export default {
  name: 'manageContestNew',
  data () {
    return {
      isSubmitting: false,
      name: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(),
      access: 0
    }
  },
  methods: {
    create () {
      if (this.name === '') {
        this.$buefy.toast.open({
          message: 'Contest name cannot be empty',
          type: 'is-danger'
        })
        return
      }
      if (this.startTime > this.endTime) {
        this.$buefy.toast.open({
          message: 'Start time must be earlier than end time',
          type: 'is-danger'
        })
        return
      }
      this.isSubmitting = true
      contest.create({
        name: this.name,
        description: this.description,
        start_time: this.startTime,
        end_time: this.endTime,
        access: this.access
      })
        .then(({data}) => {
          this.$buefy.toast.open({
            message: 'Successfully created contest',
            type: 'is-success'
          })
          this.$router.push({ name: 'manageContestView', params: { contestID: data.contest_id } })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: 'Something wrong happened when create new contest',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isSubmitting = false
        })
    }
  },
  watch: {
    startTime (to, from) {
      if (to > this.endTime) {
        this.endTime = to
      }
    }
  }
}
</script>

<style scoped>
.modal-card {
  min-height: 600px;
}
</style>
