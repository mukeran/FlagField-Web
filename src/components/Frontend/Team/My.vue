<template>
<div>
  <template v-if="myTeams.length === 0">
    <div class="content has-text-grey has-text-centered">
      <p>
        <b-icon
          icon="emoticon-sad"
          size="is-large">
        </b-icon>
      </p>
      <p>You don't belong to any team.</p>
    </div>
  </template>
  <template v-else>
    <template v-for="(row, i) in teamRows">
      <div class="tile is-ancestor" :key="i">
        <template v-for="(item, j) in row">
          <div class="tile is-4 is-parent" :key="j">
            <article :class="['title', 'is-child', 'notification', 'problem-info', 'box']" @click="$router.push({ name: 'teamView', params: { teamID: item.id }})">
              <p class="heading">{{ item.detail !== null ? new Date(item.detail.create_at).toLocaleDateString() : '' }}</p>
              <p class="title">{{ item.name }}</p>
              <p class="subtitle">{{ item.detail !== null ? item.detail.member_count + ' members' : '' }}</p>
            </article>
          </div>
        </template>
      </div>
    </template>
  </template>
</div>
</template>

<script>
import { mapState } from 'vuex'
import NewTeamModal from '../../Manage/Team/New'
export default {
  name: 'My',
  components: { NewTeamModal },
  data () {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      myTeams: state => state.team.myTeams
    }),
    teamRows () {
      if (this.myTeams === null) {
        return []
      }
      let rows = []
      let count = 0
      this.myTeams.forEach((val) => {
        if (count % 3 === 0) {
          rows.push([])
        }
        rows[Math.floor(count / 3)].push(val)
        ++count
      })
      return rows
    }
  },
  methods: {
    load () {
      this.$store.dispatch('team/loadMyTeamDetail')
        .catch((err) => {
          this.$store.dispatch('session/informConnectionError', err)
        })
        .finally(() => {
          this.isLoading = false
        })
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
.problem-info {
  width: 100%;
}
.problem-info:hover {
  cursor: pointer;
  background-color: LightGray;
  color: #363636;
}
.problem-info:hover>.title {
  color: #363636;
}
.problem-info:hover>.subtitle {
  color: #363636;
}
.problem-info>.title {
  font-size: 25px;
}
.problem-info>.subtitle {
  font-size: 20px;
}
</style>
