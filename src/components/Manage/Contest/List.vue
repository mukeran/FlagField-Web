<template>
 <section class="section">
   <div class="title-body">
     <p class="title">Contests <button class="button is-primary" @click="isNewContestModalActive = true"><b-icon icon="plus"></b-icon><span>New</span></button></p>
   </div>
   <div class="level">
     <div class="level-left">
       <b-field grouped group-multiline>
         <button class="button field" @click="checkedContests = []" :disabled="!checkedContests.length">
           <b-icon icon="close"></b-icon>
           <span>Clear checked</span>
         </button>
         <button class="button field is-danger" @click="deleteCheckedContest" :disabled="!checkedContests.length">
           <b-icon icon="delete-forever"></b-icon>
           <span>Delete checked</span>
         </button>
       </b-field>
     </div>
     <div class="level-right">
       <b-field>
         <b-input
           placeholder="Search..."
           type="search"
           icon="magnify">
         </b-input>
         <p class="control">
           <button class="button is-primary">Search</button>
         </p>
       </b-field>
     </div>
   </div>
   <b-table
     :data="contests"
     striped
     hoverable
     checkable
     paginated
     pagination-position="bottom"
     :per-page="20"
     :current-page.sync="currentPage"
     :checked-rows.sync="checkedContests"
     :loading="isLoading"
     :row-class="() => 'list-row'"
     @click="enter">
     <template slot-scope="props">
       <b-table-column field="id" label="ID" width="40" numeric sortable>
         {{ props.row.id }}
       </b-table-column>
       <b-table-column field="name" label="Name" sortable>
         {{ props.row.name }}
       </b-table-column>
       <b-table-column field="start_time" label="Start Time" sortable>
         {{ (new Date(props.row.start_time)).toLocaleString() }}
       </b-table-column>
       <b-table-column field="end_time" label="End Time" sortable>
         {{ (new Date(props.row.end_time)).toLocaleString() }}
       </b-table-column>
       <b-table-column field="access" label="Access">
         <span v-if="props.row.access === $const.contest_access.REGISTER">Register</span>
         <span v-else>Private</span>
       </b-table-column>
       <b-table-column label="Status">
         <b-tag type="is-info" v-if="status(props) === 0">Pending</b-tag>
         <b-tag type="is-danger" v-else-if="status(props) === 1">Running</b-tag>
         <b-tag type="is-success" v-else>Ended</b-tag>
       </b-table-column>
     </template>
     <template slot="empty">
       <section class="section">
         <div class="content has-text-grey has-text-centered">
           <p>
             <b-icon
               icon="emoticon-sad"
               size="is-large">
             </b-icon>
           </p>
           <p>No contests.</p>
         </div>
       </section>
     </template>
     <template slot="bottom-left">
       <b-field grouped group-multiline>
         <button class="button field" @click="checkedContests = []" :disabled="!checkedContests.length">
           <b-icon icon="close"></b-icon>
           <span>Clear checked</span>
         </button>
         <button class="button field is-danger" @click="deleteCheckedContest" :disabled="!checkedContests.length">
           <b-icon icon="delete-forever"></b-icon>
           <span>Delete checked</span>
         </button>
       </b-field>
     </template>
   </b-table>
   <b-modal
     :active.sync="isNewContestModalActive"
     has-modal-card
     trap-focus
     :can-cancel="false"
     aria-role="dialog"
     aria-modal>
     <new-contest></new-contest>
   </b-modal>
 </section>
</template>

<script>
import contest from '../../../api/contest'
import newContest from './New'

export default {
  name: 'manageContestList',
  components: { newContest },
  data () {
    return {
      isLoading: true,
      isNewContestModalActive: false,
      contests: [],
      checkedContests: [],
      currentPage: 1
    }
  },
  computed: {
  },
  methods: {
    load () {
      this.isLoading = true
      contest.list()
        .then(({data}) => {
          if (data.contests === null) {
            this.contests = []
          } else {
            this.contests = data.contests
          }
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: 'Failed to fetch contest list',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    status (props) {
      let currentTime = new Date()
      let startTime = new Date(props.row.start_time)
      let endTime = new Date(props.row.end_time)
      if (currentTime < startTime) {
        return 0
      } else if (startTime <= currentTime && currentTime < endTime) {
        return 1
      } else {
        return 2
      }
    },
    enter (row) {
      this.$router.push({ name: 'manageContestView', params: { contestID: row.id } })
    },
    deleteCheckedContest () {
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
.list-row:hover {
  cursor: pointer;
}
</style>
