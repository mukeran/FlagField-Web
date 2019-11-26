<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Create A New Problem</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <b-field label="Alias" label-position="on-border">
        <b-input v-model="alias" size="is-medium" placeholder="Problem alias is the unique problem ID of a contest"></b-input>
      </b-field>
      <b-field label="Name" label-position="on-border">
        <b-input v-model="name" size="is-medium" placeholder="The name of the problem"></b-input>
      </b-field>
      <b-field label="Description" label-position="on-border">
        <b-input v-model="description" size="is-medium" type="textarea" placeholder="Markdown supported"></b-input>
      </b-field>
      <b-field label="Points" label-position="on-border">
        <b-numberinput v-model="points" size="is-medium"></b-numberinput>
      </b-field>
      <b-field label="Type" label-position="on-border">
        <b-input v-model="type" size="is-medium" placeholder="Such as web, pwn, etc..."></b-input>
      </b-field>
    </section>
    <footer class="modal-card-foot" style="justify-content: flex-end">
      <button class="button" @click="$parent.close()" :disabled="isSubmitting">Cancel</button>
      <button class="button is-primary" @click="create" :disabled="isSubmitting">Create</button>
    </footer>
  </div>
</template>

<script>
import problem from '../../../../../api/problem'

export default {
  name: 'ProblemNew',
  data () {
    return {
      isSubmitting: false,
      alias: '',
      name: '',
      description: '',
      points: 0,
      type: ''
    }
  },
  methods: {
    create () {
      if (this.alias === '') {
        this.$buefy.toast.open({
          message: `Problem alias can't be empty`,
          type: 'is-danger'
        })
        return
      }
      if (this.name === '') {
        this.$buefy.toast.open({
          message: `Problem name can't be empty`,
          type: 'is-danger'
        })
        return
      }
      this.isSubmitting = true
      problem.create(this.$route.params.contestID, {
        alias: this.alias,
        name: this.name,
        description: this.description,
        points: this.points,
        type: this.type
      })
        .then(({data}) => {
          this.$buefy.toast.open({
            message: 'Successfully created problem',
            type: 'is-success'
          })
          this.$router.push({ name: 'manageContestViewProblemView', params: { contestID: this.$route.params.contestID, problemAlias: data.problem_alias } })
        })
        .catch(({response}) => {
          if (typeof response.data.status !== 'undefined' && response.data.status === this.$const.status.DUPLICATED_ALIAS) {
            this.$buefy.toast.open({
              message: 'Duplicated problem alias, please change another one',
              type: 'is-danger'
            })
          } else {
            this.$buefy.toast.open({
              message: 'Failed to create problem, message:' + response.data.message,
              type: 'is-danger'
            })
          }
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
