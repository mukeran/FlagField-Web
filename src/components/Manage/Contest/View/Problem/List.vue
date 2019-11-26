<template>
  <div>
    <div class="level">
      <div class="level-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checkedProblems = []" :disabled="!checkedProblems.length">
            <b-icon icon="close"></b-icon>
            <span>Clear checked</span>
          </button>
          <button class="button field is-danger" @click="deleteCheckedProblem" :disabled="!checkedProblems.length">
            <b-icon icon="delete-forever"></b-icon>
            <span>Delete checked</span>
          </button>
          <b-dropdown aria-role="list" :disabled="!checkedProblems.length">
            <button class="button" slot="trigger">
              <span>Set checked as</span>
              <b-icon icon="menu-down"></b-icon>
            </button>
            <b-dropdown-item aria-role="listitem">Hidden</b-dropdown-item>
            <b-dropdown-item aria-role="listitem">Unhidden</b-dropdown-item>
          </b-dropdown>
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
      :data="problems"
      striped
      hoverable
      checkable
      paginated
      pagination-position="bottom"
      :pagination-simple="true"
      :per-page="10"
      :current-page.sync="currentPage"
      :checked-rows.sync="checkedProblems"
      :loading="isLoading"
      :row-class="() => 'list-row'">
      <template slot-scope="props">
        <b-table-column field="alias" label="Alias" @click.native="enter(props.row.alias)" sortable>
          {{ props.row.alias }}
        </b-table-column>
        <b-table-column field="name" label="Name" @click.native="enter(props.row.alias)" sortable>
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="points" label="Points" @click.native="enter(props.row.alias)" sortable>
          {{ props.row.points }}
        </b-table-column>
        <b-table-column field="type" label="Type" @click.native="enter(props.row.alias)" sortable>
          {{ props.row.type }}
        </b-table-column>
        <b-table-column field="hidden" label="Hidden" width="40" sortable>
          <b-switch v-model="props.row.is_hidden" @input="updateHidden(props.row.order)" :disabled="props.row.is_updating"></b-switch>
        </b-table-column>
        <b-table-column field="delete" label="Delete" width="40">
          <b-button type="is-danger" size="is-small" @click=";(props.row.order)" :disabled="props.row.is_updating">Delete</b-button>
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
            <p>No problem here.</p>
          </div>
        </section>
      </template>
      <template slot="bottom-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checkedProblems = []" :disabled="!checkedProblems.length">
            <b-icon icon="close"></b-icon>
            <span>Clear checked</span>
          </button>
          <button class="button field is-danger" @click="deleteCheckedProblem" :disabled="!checkedProblems.length">
            <b-icon icon="delete-forever"></b-icon>
            <span>Delete checked</span>
          </button>
          <b-dropdown aria-role="list" :disabled="!checkedProblems.length">
            <button class="button" slot="trigger">
              <span>Set checked as</span>
              <b-icon icon="menu-down"></b-icon>
            </button>
            <b-dropdown-item aria-role="listitem" @click="hiddenCheckedProblem">Hidden</b-dropdown-item>
            <b-dropdown-item aria-role="listitem" @click="unhiddenCheckedProblem">Unhidden</b-dropdown-item>
          </b-dropdown>
        </b-field>
      </template>
    </b-table>
    <b-modal
      :active.sync="_isNewProblemModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <new-problem></new-problem>
    </b-modal>
  </div>
</template>

<script>
import newProblem from './New'
import problem from '../../../../../api/problem'

export default {
  name: 'ProblemList',
  components: { newProblem },
  props: {
    isNewProblemModalActive: Boolean
  },
  data () {
    return {
      isLoading: true,
      problems: [],
      currentPage: 1,
      checkedProblems: []
    }
  },
  computed: {
    _isNewProblemModalActive: {
      get () {
        return this.isNewProblemModalActive
      },
      set (value) {
        this.$emit('on-is-new-problem-modal-active-changed', value)
      }
    }
  },
  methods: {
    load () {
      this.isLoading = true
      problem.list(this.$route.params.contestID)
        .then(({data}) => {
          if (data.problems !== null) {
            for (let i = 0; i < data.problems.length; i++) {
              data.problems[i].order = i
              data.problems[i].is_updating = false
              if (typeof data.problems[i].is_hidden === 'undefined') {
                data.problems[i].is_hidden = false
              }
            }
            this.problems = data.problems
          } else {
            this.problems = []
          }
        })
        .catch(() => {
          this.problems = []
          this.$buefy.toast.open({
            message: `Failed to fetch contest's problems`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    enter (alias) {
      this.$router.push({ name: 'manageContestViewProblemView', params: { problemAlias: alias } })
    },
    updateHidden (order) {
      this.problems[order].is_updating = true
      problem.modifyByAlias(this.$route.params.contestID, this.problems[order].alias, {
        is_hidden: this.problems[order].is_hidden
      })
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully changed the hidden status of problem ${this.problems[order].alias}`,
            type: 'is-success'
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: `Failed to change the hidden status of problem ${this.problems[order].alias}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.problems[order].is_updating = false
        })
    },
    deleteProblem (order) {
      this.problems[order].is_updating = true
      problem.deleteByAlias(this.$route.params.contestID, this.problems[order].alias)
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully deleted problem ${this.problems[order].alias}`,
            type: 'is-success'
          })
          this.load()
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: `Failed to delete problem ${this.problems[order].alias}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.problems[order].is_updating = false
        })
    },
    deleteCheckedProblem () {
    },
    hiddenCheckedProblem () {
    },
    unhiddenCheckedProblem () {
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
.list-row:hover {
  cursor: pointer;
}
</style>
