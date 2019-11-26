<template>
  <section class="section">
    <router-link :to="routeRelative('..')" append>&lt; Back</router-link>
    <template v-if="teamDetail !== null">
      <b-field style="margin-top: 10px">
        <p class="control">
          <b-button size="is-large" type="is-static" :disabled="isLoading || (!isDetail)">{{ teamDetail.team_id }}</b-button>
        </p>
        <b-input v-model="teamDetail.name" placeholder="Contest name" size="is-large" :readonly="!admin"
                 @keyup.enter.native="commitDetail" :disabled="isLoading || (!isDetail)" expanded></b-input>
      </b-field>
      <div class="subtitle">
          {{ teamDetail.member_count }} members
          <span class="is-pulled-right subtitle">created at: {{ new Date(teamDetail.create_at).toLocaleDateString() }}</span>
        </div>
    </template>
    <template v-else>
      <div class="content has-text-grey has-text-centered">
        <p>
          <b-icon
            icon="emoticon-sad"
            size="is-large">
          </b-icon>
        </p>
        <p>No such team.</p>
      </div>
    </template>
    <div class="columns">
      <div class="column is-one-quarter">
        <b-menu>
          <b-menu-list label="MENU">
            <b-menu-item icon="information-variant" label="Detail" tag="router-link" :to="routeRelative('.')" @click="() => this.loadTeamDetail()" :active="isDetail"></b-menu-item>
            <b-menu-item icon="account" label="Member" tag="router-link" :to="routeRelative('member')" append :active="isMember"></b-menu-item>
            <b-menu-item icon="account-outline" label="Admin" tag="router-link" :to="routeRelative('admin')" :active="isAdmin"></b-menu-item>
            <b-menu-item icon="account-circle" label="Invitation" tag="router-link" :to="routeRelative('invitation')" :active="isInvitation"></b-menu-item>
            <b-menu-item icon="account-badge" label="Application" tag="router-link" :to="routeRelative('application')" :active="isApplication"></b-menu-item>
          </b-menu-list>
          <b-menu-list label="Actions">
            <b-menu-item v-show="isMember" icon="plus" label="New Member" @click="isMemberModalActive = true" :disabled="isLoading"></b-menu-item>
            <b-menu-item v-show="isInvitation" icon="plus" label="New Invitation" @click="isInvitationModalActive = true" :disabled="isLoading"></b-menu-item>
            <b-menu-item v-show="isDetail" icon="check-circle-outline" label="Submit" @click="commitDetail" :disabled="isLoading"></b-menu-item>
            <b-menu-item icon="delete-forever" label="Delete Team" @click="confirmDelete" :disabled="isLoading"></b-menu-item>
          </b-menu-list>
        </b-menu>
      </div>
      <div class="column">
        <router-view :teamID="teamID" v-bind="routerProps"
        @update:isMemberModalActive="(val) => { isMemberModalActive = val }"
        @update:isInvitationModalActive="(val) => { isInvitationModalActive = val }"/>
        <div v-if="teamDetail !== null" v-show="isDetail">
          <b-field label="Description:">
            <b-input
              type="textarea"
              @keyup.enter.native="commitDetail"
              v-model="teamDetail.description"
              :disabled="isLoading"></b-input>
          </b-field>
        </div>
      </div>
    </div>
    <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
  </section>
</template>

<script>
import team from '../../../../api/team'
import { mapInRoute } from '../../../../common'
export default {
  name: 'TeamManageFrame',
  props: {
    admin: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      teamDetail: null,
      isLoading: false,
      teamID: parseInt(this.$route.params.teamID),
      isMemberModalActive: false,
      isInvitationModalActive: false
    }
  },
  computed: {
    ...mapInRoute({
      isDetail: ['manageTeamView', 'teamManage'],
      isMember: ['manageTeamMember', 'teamMember'],
      isAdmin: ['manageTeamAdmin', 'teamAdmin'],
      isInvitation: ['manageTeamInvitation', 'teamInvitation'],
      isApplication: ['manageTeamApplication', 'teamApplication']
    }),
    routerProps () {
      if (this.isMember) {
        return {
          isMemberModalActive: this.isMemberModalActive
        }
      } else if (this.isAdmin) {
        return {
        }
      } else if (this.isInvitation) {
        return {
          isInvitationModalActive: this.isInvitationModalActive
        }
      } else if (this.isApplication) {
        return {
        }
      }
      return {}
    },
    routeDeep () { // depth
      if (this.isDetail) { return 0 } return 1
    }
  },
  methods: {
    routeRelative (name) {
      let f = new Map([
        ['..', { name: 'teamView', params: { teamID: this.teamID } }],
        ['.', { name: 'teamManage', params: { teamID: this.teamID } }],
        ['member', { name: 'teamMember' }],
        ['admin', { name: 'teamAdmin' }],
        ['invitation', { name: 'teamInvitation' }],
        ['application', { name: 'teamApplication' }]
      ])
      let m = new Map([
        ['..', { name: 'manageTeam', params: { teamID: this.teamID } }],
        ['.', { name: 'manageTeamView', params: { teamID: this.teamID } }],
        ['member', { name: 'manageTeamMember' }],
        ['admin', { name: 'manageTeamAdmin' }],
        ['invitation', { name: 'manageTeamInvitation' }],
        ['application', { name: 'manageTeamApplication' }]
      ])
      if (this.admin === true) {
        return m.get(name)
      } else {
        return f.get(name)
      }
    },
    clear () {
      this.teamDetail = null
    },
    loadTeamDetail () {
      this.isLoading = true
      team.getByID(this.teamID).then((res) => {
        this.teamDetail = res.data.team
      }).catch((err) => {
        this.clear()
        this.$store.dispatch('session/informConnectionError', err)
      }).finally(() => {
        this.isLoading = false
      })
    },
    commitDetail () {
      let data = { description: this.teamDetail.description }
      if (this.admin) {
        data.name = this.teamDetail.name
      }
      team.modifyByID(this.teamID, data)
        .then((res) => {
          this.$buefy.toast.open({
            message: 'Modified successfully',
            type: 'is-success'
          })
          this.$emit('updated')
          this.loadTeamDetail()
        }).catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
    },
    confirmDelete () {
      this.$buefy.dialog.confirm({
        message: 'Are you sure to delete the team?',
        onConfirm: () => this.delete()
      })
    },
    delete () {
      team.deleteByID(this.teamID).then((res) => {
        this.$buefy.toast.open({
          message: 'deleted successfully',
          type: 'is-success'
        })
        this.$emit('updated')
        this.loadTeamDetail()
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      })
    },
    load () {
      this.loadTeamDetail()
    }
  },
  watch: {
    '$route' (from, to) {
      if (to.params.teamID !== from.params.teamID) {
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
.title {
  font-family: Lato, sans-serif;
  font-weight: normal;
}
.subtitle {
  font-family: Lato, sans-serif;
}
.title-body {
  margin-bottom: 30px;
}
</style>
