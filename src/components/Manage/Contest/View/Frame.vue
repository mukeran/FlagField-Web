<template>
  <section class="section">
    <router-link v-if="!isPractice" :to="{ name: 'manageContestList' }">&lt; Back to Contest List</router-link>
    <template v-if="contest === null">
      <div class="content has-text-grey has-text-centered">
        <p>
          <b-icon
            icon="emoticon-sad"
            size="is-large">
          </b-icon>
        </p>
        <p>No such contest.</p>
      </div>
    </template>
    <template v-else>
      <b-field v-if="!isPractice" style="margin-top: 10px">
        <p class="control">
          <b-button size="is-large" type="is-static" :disabled="isLoading || (!isDescription && !isSettings)">{{ contest.id }}</b-button>
        </p>
        <b-input v-model="contest.name" placeholder="Contest name" size="is-large" :disabled="isLoading || (!isDescription && !isSettings)" expanded></b-input>
      </b-field>
      <div v-else class="title-body">
        <p class="title">Practice</p>
      </div>
      <div class="columns">
        <div class="column is-one-quarter">
          <b-menu>
            <b-menu-list label="Menu">
              <b-menu-item v-if="!isPractice" icon="information-variant" label="Description" tag="router-link" :to="{ name: 'manageContestView' }" :active="isDescription"></b-menu-item>
              <b-menu-item icon="help" label="Problems" tag="router-link" :to="{ name: 'manageContestViewProblemList' }" :active="isProblemList"></b-menu-item>
              <b-menu-item v-if="!isPractice" icon="account-multiple" label="Teams" tag="router-link" :to="{ name: 'manageContestViewTeam' }" :active="isTeam"></b-menu-item>
              <b-menu-item icon="paperclip" label="Resources" tag="router-link" :to="{ name: 'manageContestViewResource' }" :active="isResource"></b-menu-item>
              <b-menu-item icon="bell-outline" label="Notifications" tag="router-link" :to="{ name: 'manageContestViewNotification' }" :active="isNotification"></b-menu-item>
              <b-menu-item v-if="!isPractice" icon="settings" label="Settings" tag="router-link" :to="{ name: 'manageContestViewSettings' }" :active="isSettings"></b-menu-item>
            </b-menu-list>
            <b-menu-list label="Actions">
              <b-menu-item v-if="isDescription || isSettings" icon="check-circle-outline" label="Submit" @click="confirmSubmit" :disabled="isSubmitting || isLoading"></b-menu-item>
              <b-menu-item v-if="isProblemList" icon="plus" label="New Problem" @click="isNewProblemModalActive = true"></b-menu-item>
              <b-menu-item v-if="isTeam" icon="plus" label="Add Team" @click="isAddTeamModalActive = true"></b-menu-item>
              <b-menu-item v-if="isResource" icon="upload" label="Upload Resource" @click="isUploadResourceModalActive = true"></b-menu-item>
              <b-menu-item v-if="isNotification" icon="plus" label="New Notification" @click="isNewNotificationModalActive = true"></b-menu-item>
              <b-menu-item v-if="!isPractice" icon="delete-forever" label="Delete Contest" @click="confirmDelete" :disabled="isSubmitting || isLoading"></b-menu-item>
            </b-menu-list>
          </b-menu>
        </div>
        <div class="column">
          <div v-if="isDescription" style="position: relative">
            <template v-if="isPractice">
              <span>Please select one of the sections in the menu.</span>
            </template>
            <template v-else>
              <b-field grouped group-multiline style="margin-bottom: 10px">
                <button v-if="!isPreviewing" class="button field is-info" @click="isPreviewing = true">
                  <b-icon icon="file-find"></b-icon>
                  <span>Enter Preview Mode</span>
                </button>
                <button v-if="isPreviewing" class="button field is-info" @click="isPreviewing = false">
                  <b-icon icon="code-tags"></b-icon>
                  <span>Enter Code Mode</span>
                </button>
              </b-field>
              <codemirror v-if="!isPreviewing" v-model="contest.description" :options="descriptionCmOptions"></codemirror>
              <div v-if="isPreviewing" class="markdown-body" v-html="description"></div>
            </template>
          </div>
          <router-view
            v-bind="routerProps"
            @on-is-new-problem-modal-active-changed="onIsNewProblemModalActiveChanged"
            @on-is-add-team-modal-active-changed="onIsAddTeamModalActiveChanged"
            @on-is-upload-resource-modal-active-changed="onIsUploadResourceModalActiveChanged"
            @on-is-new-notification-modal-active-changed="onIsNewNotificationModalActiveChanged"></router-view>
        </div>
      </div>
    </template>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import contest from '../../../../api/contest'
import { mapIsRoute } from '../../../../common'
import 'codemirror/mode/markdown/markdown'

export default {
  name: 'ManageContestView',
  data () {
    return {
      isLoading: true,
      isPreviewing: false,
      isSubmitting: false,
      contest: null,
      descriptionCmOptions: {
        tabSize: 2,
        mode: 'text/x-markdown',
        theme: 'default',
        lineNumbers: true,
        line: true
      },
      isNewProblemModalActive: false,
      isAddTeamModalActive: false,
      isUploadResourceModalActive: false,
      isNewNotificationModalActive: false
    }
  },
  computed: {
    ...mapIsRoute({
      isDescription: 'manageContestView',
      isProblemList: 'manageContestViewProblemList',
      isTeam: 'manageContestViewTeam',
      isResource: 'manageContestViewResource',
      isNotification: 'manageContestViewNotification',
      isSettings: 'manageContestViewSettings'
    }),
    isPractice () {
      return this.$route.params.contestID === '__practice__' || this.$route.params.contestID === 1 // 1 is the default contest created by setup
    },
    description () {
      return this.$md.makeHtml(this.contest.description)
    },
    routerProps () {
      if (this.isSettings) {
        return {
          contest: this.contest
        }
      } else if (this.isProblemList) {
        return {
          isNewProblemModalActive: this.isNewProblemModalActive
        }
      } else if (this.isTeam) {
        return {
          isAddTeamModalActive: this.isAddTeamModalActive
        }
      } else if (this.isResource) {
        return {
          isUploadResourceModalActive: this.isUploadResourceModalActive
        }
      } else if (this.isNotification) {
        return {
          isNewNotificationModalActive: this.isNewNotificationModalActive
        }
      }
      return {}
    }
  },
  methods: {
    load () {
      this.isLoading = true
      contest.getByID(this.$route.params.contestID)
        .then(({data}) => {
          data.contest.start_time = new Date(data.contest.start_time)
          data.contest.end_time = new Date(data.contest.end_time)
          if (typeof data.contest.is_hidden === 'undefined') {
            data.contest.is_hidden = false
          }
          this.contest = data.contest
          if ((this.isDescription || this.isTeam || this.isSettings) && this.isPractice) {
            this.$router.push({ name: 'manageContestViewProblemList' })
          }
        })
        .catch(() => {
          this.contest = null
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    submit () {
      let p
      if (this.isDescription) {
        p = contest.modifyByID(this.$route.params.contestID, {
          name: this.contest.name,
          description: this.contest.description
        })
      } else {
        if (this.contest.start_time > this.contest.end_time) {
          this.$buefy.dialog.alert('Start time must be ahead of end time')
          return
        }
        p = contest.modifyByID(this.$route.params.contestID, {
          name: this.contest.name,
          start_time: this.contest.start_time,
          end_time: this.contest.end_time,
          access: parseInt(this.contest.access),
          is_hidden: this.contest.is_hidden
        })
      }
      this.isSubmitting = true
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
    delete () {
      this.isSubmitting = true
      contest.deleteByID(this.$route.params.contestID)
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully deleted contest ${this.$route.params.contestID}`,
            type: 'is-success'
          })
          this.$router.push({ name: 'manageContestList' })
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to delete this contest. Message: ${response.data.message}`,
            type: 'is-danger'
          })
          console.log(response.data)
        })
        .finally(() => {
          this.isSubmitting = false
        })
    },
    confirmDelete () {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to delete this contest?',
        onConfirm: () => this.delete()
      })
    },
    onIsNewProblemModalActiveChanged (value) {
      this.isNewProblemModalActive = value
    },
    onIsAddTeamModalActiveChanged (value) {
      this.isAddTeamModalActive = value
    },
    onIsUploadResourceModalActiveChanged (value) {
      this.isUploadResourceModalActive = value
    },
    onIsNewNotificationModalActiveChanged (value) {
      this.isNewNotificationModalActive = value
    }
  },
  watch: {
    $route (to, from) {
      if (to.params.contestID !== from.params.contestID) {
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

<style>
.title {
  font-family: Lato, sans-serif;
  font-weight: normal;
}
.title-body {
  margin-bottom: 30px;
}
.markdown-body {
  box-sizing: border-box;
  min-width: 200px;
  max-width: 980px;
  margin: 0 auto;
  padding: 0 45px;
}

@media (max-width: 767px) {
  .markdown-body {
    padding: 0 15px;
  }
}
.CodeMirror {
  border: 1px solid #eee;
  height: 500px;
}
</style>
