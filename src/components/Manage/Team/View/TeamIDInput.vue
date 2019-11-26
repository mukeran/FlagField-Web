<template>
  <div>
    <b-field label="Team" label-position="on-border">
      <b-taginput
        :maxtags="maxtags || 1"
        v-model="teams"
        :data="filteredTeams"
        autocomplete
        field="name"
        size="is-medium"
        :loading="isFetchingTeams || loading === true"
        :before-adding="teamCheck"
        @add="teamAdd"
        @remove="teamRemove"
        :open-on-focus="true"
        placeholder="Type team name to select"
        @focus="() => {teamGet('')}"
        @typing="teamGet">
        <template slot-scope="props">
            <div>
              {{ props.option.team_id }} | {{ props.option.name }} | {{ props.option.member_count }} members
            </div>
        </template>
        <template slot="empty">
          Not found
        </template>
      </b-taginput>
    </b-field>
  </div>
</template>

<script>
import debounce from 'debounce'
import team from '../../../../api/team'
export default {
  name: 'TeamIDInput',
  props: ['loading', 'selected', 'maxtags'], // maxtags default for 1
  data () {
    return {
      isFetchingTeams: false,
      teams: [],
      selectedTeams: this.selected || new Set(),
      filteredTeams: []
    }
  },
  methods: {
    teamCheck (team) {
      if (this.selectedTeams.has(team.team_id)) {
        this.$buefy.toast.open({
          message: 'You have selected this team!',
          type: 'is-danger'
        })
        return false
      }
      return true
    },
    teamAdd (team) {
      this.selectedTeams.add(team.team_id)
      this.$emit('update:selected', this.selectedTeams)
    },
    teamRemove (team) {
      this.selectedTeams.delete(team.team_id)
      this.$emit('update:selected', this.selectedTeams)
    },
    teamGet: debounce(function (text) {
      this.isFetchingTeams = true
      team.all().then((res) => {
        this.filteredTeams = (res.data.teams || []).filter((option) => {
          return option.name
            .toString()
            .toLowerCase()
            .indexOf(text.toLowerCase()) >= 0
        })
      })
        .catch((err) => {
          this.filteredTeams = []
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          this.isFetchingTeams = false
        })
    }, 100),
    clear () {
      this.teams = []
      this.selectedTeams = new Set()
      this.$emit('update:selected', this.selectedTeams)
    }
  }
}
</script>

<style scoped>

</style>
