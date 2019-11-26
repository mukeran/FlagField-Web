<template>
  <section class="section">
    <div class="level">
      <div class="level-left">
        <router-link :to="{ name: 'teamList' }">&lt; Back to my teams.</router-link>
      </div>
      <div class="level-right">
        <router-link :to="{ name: 'teamManage', params: { teamID: $route.params.teamID }}">Manage ></router-link>
      </div>
    </div>
    <b-tabs type="is-boxed">
      <b-tab-item label="Detail">
        <section :style="{ position: 'relative' }">
          <template v-if="team !== null">
            <section class="has-text-centered">
              <h1 class="title">
                {{ team.name }}
              </h1>
              <h2 class="subtitle">
                {{ team.member_count }} members
              </h2>
            </section>
            <section class="section">
              <span class="subtitle">description: </span>
              <br/>
              <span>{{ team.description }}</span>
            </section>
            <hr>
            <template v-if="members !== null">
              <template v-for="(user, i) in members">
                <div class="card team-member-card has-text-centered" @click="$router.push({ name: 'userProfile', params: { userID: user.id } })" :key="i">
                  <div class="card-image">
                    <figure class="image is-1by1">
                      <img :src="`https://cn.gravatar.com/avatar/${user.email_hash}`" height="80" width="80" :alt="`${user.username}'s avatar`">
                    </figure>
                  </div>
                  <div class="team-member-content">
                    <span class="team-member-name">{{ user.username }}</span>
                  </div>
                </div>
              </template>
            </template>
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
          <b-loading :is-full-page="false" :active.sync="isLoading"></b-loading>
        </section>
      </b-tab-item>
      <b-tab-item label="Members">
        <b-table
          :data="members"
          :columns="memberColumns"
          :loading="isLoading">
        </b-table>
      </b-tab-item>
    </b-tabs>
  </section>
</template>

<script>
import team from '../../../api/team'
export default {
  name: 'TeamView',
  data () {
    return {
      teamID: 0,
      team: null,
      members: [],
      isLoading: false,
      statistics: [],
      isLoadingStatistic: false,
      memberColumns: [
        {
          field: 'id',
          label: 'ID',
          width: '40',
          numeric: true
        },
        {
          field: 'username',
          label: 'Name'
        },
        {
          field: 'nickname',
          label: 'Nick Name'
        }
      ]
    }
  },
  methods: {
    loadTeamDetail () {
      team.getByID(this.$route.params.teamID).then((res) => {
        this.team = res.data.team
      }).catch((err) => {
        this.team = null
        this.$store.dispatch('session/informConnectionError', err)
      })
      team.getMemberByID(this.$route.params.teamID, {}).then((res) => {
        this.isLoading = false
        this.members = res.data.members
      }).catch((err) => {
        this.isLoading = false
        this.members = []
        this.$store.dispatch('session/informConnectionError', err)
      })
      this.isLoadingStatistic = true
      team.getStatisticByID(this.$route.params.teamID).then((res) => {
        this.isLoadingStatistic = false
        this.statistics = res.data.contests
      }).catch((err) => {
        this.isLoadingStatistic = false
        this.statistics = []
        this.$store.dispatch('session/informConnectionError', err)
      })
    }
  },
  watch: {
    '$route' (from, to) {
      this.loadTeamDetail()
    }
  },
  beforeRouteEnter (from, to, next) {
    next(vm => {
      vm.loadTeamDetail()
    })
  }
}
</script>

<style scoped>
.team-section>.team-section-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
.team-section>.team-section-separator {
  margin-top: 0;
}
.team-member-card {
  width: 80px;
  min-height: 100px;
  display: inline-block;
  margin: 0 1rem 0.8rem;
  vertical-align: top;
  border: 0;
}
.team-member-card:hover {
  cursor: pointer;
}
.team-member-card>.team-member-content {
  word-wrap: break-word;
  word-break: break-all;
  line-height: 1.2rem;
}
</style>
