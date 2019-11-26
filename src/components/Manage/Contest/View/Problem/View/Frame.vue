<template>
  <section class="section">
    <router-link :to="{ name: 'manageContestViewProblemList', params: { contestID: $route.params.contestID } }">&lt; Back to <template v-if="isPractice">Practice</template><template v-else>Contest</template> Problem List</router-link>
    <template v-if="problem === null">
      <div class="content has-text-grey has-text-centered">
        <p>
          <b-icon
            icon="emoticon-sad"
            size="is-large">
          </b-icon>
        </p>
        <p>No such problem.</p>
      </div>
    </template>
    <template v-else>
      <b-field style="margin-top: 10px">
        <p class="control">
          <b-button size="is-large" type="is-static" :disabled="isLoading || (!isDescription && !isSettings)">{{ problem.alias }}</b-button>
        </p>
        <b-input v-model="problem.name" placeholder="Problem name" size="is-large" :disabled="isLoading || (!isDescription && !isSettings)" expanded></b-input>
      </b-field>
      <div class="columns">
        <div class="column is-one-quarter">
          <b-menu>
            <b-menu-list label="Menu">
              <b-menu-item icon="information-variant" label="Description" tag="router-link" :to="{ name: 'manageContestViewProblemView' }" :active="isDescription"></b-menu-item>
              <b-menu-item icon="flag" label="Flags" tag="router-link" :to="{ name: 'manageContestViewProblemViewFlag' }" :active="isFlag"></b-menu-item>
              <b-menu-item icon="lightbulb-on" label="Hints" tag="router-link" :to="{ name: 'manageContestViewProblemViewHint' }" :active="isHint"></b-menu-item>
              <b-menu-item icon="paperclip" label="Resources" tag="router-link" :to="{ name: 'manageContestViewProblemViewResource' }" :active="isResource"></b-menu-item>
              <b-menu-item icon="settings" label="Settings" tag="router-link" :to="{ name: 'manageContestViewProblemViewSettings' }" :active="isSettings"></b-menu-item>
            </b-menu-list>
            <b-menu-list label="Actions">
              <b-menu-item v-if="isDescription || isSettings" icon="check-circle-outline" label="Submit" @click="confirmSubmit" :disabled="isSubmitting"></b-menu-item>
              <b-menu-item v-if="isFlag" icon="plus" label="New Flag" @click="isNewFlagModalActive = true"></b-menu-item>
              <b-menu-item v-if="isHint" icon="plus" label="New Hint" @click="isNewHintModalActive = true"></b-menu-item>
              <b-menu-item v-if="isResource" icon="upload" label="Upload Resource" @click="isUploadResourceModalActive = true"></b-menu-item>
              <b-menu-item icon="delete-forever" label="Delete Problem" @click="confirmDeleteProblem" :disabled="isSubmitting"></b-menu-item>
            </b-menu-list>
          </b-menu>
        </div>
        <div class="column">
          <template v-if="isDescription">
            <problem-description :description="problem.description" @on-description-changed="onDescriptionChanged"></problem-description>
          </template>
          <router-view
            v-bind="routerProps"
            @on-is-new-flag-modal-active-changed="onIsNewFlagModalActiveChanged"
            @on-is-new-hint-modal-active-changed="onIsNewHintModalActiveChanged"
            @on-is-upload-resource-modal-active-changed="onUploadResourceModalActiveChanged">
          </router-view>
        </div>
      </div>
    </template>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import { mapIsRoute } from '../../../../../../common'
import problem from '../../../../../../api/problem'
import ProblemDescription from './Description'

export default {
  name: 'ProblemView',
  components: { ProblemDescription },
  data () {
    return {
      isLoading: true,
      isSubmitting: false,
      problem: null,
      isNewFlagModalActive: false,
      isNewHintModalActive: false,
      isUploadResourceModalActive: false
    }
  },
  computed: {
    ...mapIsRoute({
      isDescription: 'manageContestViewProblemView',
      isFlag: 'manageContestViewProblemViewFlag',
      isHint: 'manageContestViewProblemViewHint',
      isResource: 'manageContestViewProblemViewResource',
      isSettings: 'manageContestViewProblemViewSettings'
    }),
    isPractice () {
      return this.$route.params.contestID === '__practice__' || this.$route.params.contestID === 1
    },
    description () {
      return this.$md.makeHtml(this.problem.description)
    },
    routerProps () {
      if (this.isFlag) {
        return {
          isNewFlagModalActive: this.isNewFlagModalActive
        }
      } else if (this.isHint) {
        return {
          isNewHintModalActive: this.isNewHintModalActive
        }
      } else if (this.isResource) {
        return {
          isUploadResourceModalActive: this.isUploadResourceModalActive
        }
      } else if (this.isSettings) {
        return {
          problem: this.problem
        }
      }
      return {}
    }
  },
  methods: {
    load () {
      this.isLoading = true
      problem.getByAlias(this.$route.params.contestID, this.$route.params.problemAlias)
        .then(({data}) => {
          if (typeof data.problem.is_hidden === 'undefined') {
            data.problem.is_hidden = false
          }
          this.problem = data.problem
        })
        .catch(({response}) => {
          this.problem = null
          this.$buefy.toast.open({
            message: 'Failed to load problem. Message: ' + response.data.message,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    submit () {
      let p
      if (this.isDescription) {
        p = problem.modifyByAlias(this.$route.params.contestID, this.$route.params.problemAlias, {
          name: this.problem.name,
          description: this.problem.description
        })
      } else {
        p = problem.modifyByAlias(this.$route.params.contestID, this.$route.params.problemAlias, {
          name: this.problem.name,
          type: this.problem.type,
          points: this.problem.points,
          is_hidden: this.problem.is_hidden
        })
      }
      p
        .then(() => {
          this.$buefy.dialog.alert('Successfully updated!')
        })
        .catch(({ response }) => {
          this.$buefy.dialog.alert('Update failed! Message: ' + response.data.message)
          console.log(response.data)
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    confirmSubmit () {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to submit the changes?',
        onConfirm: () => this.submit()
      })
    },
    deleteProblem () {
      this.isSubmitting = true
      problem.deleteByAlias(this.$route.params.contestID, this.$route.params.problemAlias)
        .then(() => {
          this.$buefy.toast.open({
            message: 'Successfully deleted the problem',
            type: 'is-success'
          })
          this.$router.push({ name: 'manageContestViewProblemList' })
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to delete the problem. Message: ${response.data.message}`,
            type: 'is-danger'
          })
          console.log(response.data)
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    confirmDeleteProblem () {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to delete this problem?',
        onConfirm: () => this.deleteProblem()
      })
    },
    onDescriptionChanged (value) {
      this.problem.description = value
    },
    onIsNewFlagModalActiveChanged (value) {
      this.isNewFlagModalActive = value
    },
    onIsNewHintModalActiveChanged (value) {
      this.isNewHintModalActive = value
    },
    onUploadResourceModalActiveChanged (value) {
      this.isUploadResourceModalActive = value
    }
  },
  watch: {
    $route (to, from) {
      if (to.params.contestID !== from.params.contestID || to.params.problemAlias !== from.params.problemAlias) {
        this.load()
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.load()
    })
  }
}
</script>

<style scoped>

</style>
