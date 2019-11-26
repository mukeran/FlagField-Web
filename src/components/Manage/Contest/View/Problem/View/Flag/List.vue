<template>
  <div>
    <div class="level">
      <div class="level-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checkedFlags = []" :disabled="!checkedFlags.length || isDeleting">
            <b-icon icon="close"></b-icon>
            <span>Clear checked</span>
          </button>
          <button class="button field is-danger" @click="deleteCheckedFlag" :disabled="!checkedFlags.length || isDeleting">
            <b-icon icon="delete-forever"></b-icon>
            <span>Delete checked</span>
          </button>
        </b-field>
      </div>
    </div>
    <b-table
      :data="flags"
      striped
      hoverable
      checkable
      paginated
      pagination-position="bottom"
      :pagination-simple="true"
      :per-page="10"
      :current-page.sync="currentPage"
      :checked-rows.sync="checkedFlags"
      :loading="isLoading"
      :row-class="() => 'list-row'"
      @click="enterModify">
      <template slot-scope="props">
        <b-table-column field="order" label="Order" width="40" numeric sortable>
          {{ props.row.order }}
        </b-table-column>
        <b-table-column field="type" label="Type" sortable>
          {{ props.row.type }}
        </b-table-column>
        <b-table-column field="detail" label="Detail" sortable>
          <template v-if="props.row.type === `static`">
            {{ props.row.settings.flag }}
          </template>
          <template v-else>
            Click to see details
          </template>
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
            <p>No flag.</p>
          </div>
        </section>
      </template>
      <template slot="bottom-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checkedFlags = []" :disabled="!checkedFlags.length || isDeleting">
            <b-icon icon="close"></b-icon>
            <span>Clear checked</span>
          </button>
          <button class="button field is-danger" @click="deleteCheckedFlag" :disabled="!checkedFlags.length || isDeleting">
            <b-icon icon="delete-forever"></b-icon>
            <span>Delete checked</span>
          </button>
        </b-field>
      </template>
    </b-table>
    <b-modal
      :active.sync="_isNewFlagModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <new-flag></new-flag>
    </b-modal>
    <b-modal
      :active.sync="isEditFlagModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <edit-flag :flag="clickedFlag"></edit-flag>
    </b-modal>
  </div>
</template>

<script>
import NewFlag from './New'
import EditFlag from './Edit'
import problem from '../../../../../../../api/problem'

export default {
  name: 'FlagList',
  props: {
    isNewFlagModalActive: Boolean
  },
  components: { NewFlag, EditFlag },
  data () {
    return {
      isLoading: true,
      isDeleting: false,
      isEditFlagModalActive: false,
      clickedFlag: null,
      currentPage: 1,
      flags: [],
      checkedFlags: []
    }
  },
  computed: {
    _isNewFlagModalActive: {
      get () {
        return this.isNewFlagModalActive
      },
      set (value) {
        this.$emit('on-is-new-flag-modal-active-changed', value)
      }
    }
  },
  methods: {
    load () {
      this.isLoading = true
      problem.getFlags(this.$route.params.contestID, this.$route.params.problemAlias)
        .then(({data}) => {
          if (data.flags !== null) {
            for (let i = 0; i < data.flags.length; i++) {
              data.flags[i].order = i + 1
            }
          }
          this.flags = data.flags === null ? [] : data.flags
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: 'Failed to fetch flags. Message: ' + response.data.message,
            type: 'is-danger'
          })
          console.log(response.data)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    deleteCheckedFlag () {
      this.isDeleting = true
      let orders = []
      this.checkedFlags.forEach(value => {
        orders.push(value.order)
      })
      this.checkedFlags = []
      problem.batchDeleteFlags(this.$route.params.contestID, this.$route.params.problemAlias, orders)
        .then(({data}) => {
          if (data.status === this.$const.status.PARTLY_FAILED) {
            this.$buefy.toast.open({
              message: 'Some flag successfully deleted, while the others is failed',
              type: 'is-warning'
            })
            console.log(data.details)
          } else {
            this.$buefy.toast.open({
              message: 'Successfully deleted flags',
              type: 'is-success'
            })
          }
          this.load()
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: 'Failed to delete flags. Message: ' + response.data.message,
            type: 'is-danger'
          })
          console.log(response.data)
        })
        .finally(() => {
          this.isDeleting = false
        })
    },
    enterModify (row) {
      this.clickedFlag = row
      this.isEditFlagModalActive = true
    }
  },
  watch: {
    isNewFlagModalActive (to, from) {
      if (to === false) {
        this.load()
      }
    },
    isEditFlagModalActive (to, from) {
      if (to === false) {
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
.list-row:hover {
  cursor: pointer;
}
</style>
