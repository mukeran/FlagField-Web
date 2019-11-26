<template>
  <div>
    <b-table
      :data="hints"
      striped
      hoverable
      paginated
      pagination-position="bottom"
      :pagination-simple="true"
      :per-page="10"
      :current-page.sync="currentPage"
      :loading="isLoading"
      :row-class="() => 'list-row'">
      <template slot-scope="props">
        <b-table-column field="order" label="Order" width="40" @click.native="enterModify(props.row)" numeric sortable>
          {{ props.row.order }}
        </b-table-column>
        <b-table-column field="content" label="Content" @click.native="enterModify(props.row)" sortable>
          {{ props.row.content }}
        </b-table-column>
        <b-table-column field="cost" label="Cost" @click.native="enterModify(props.row)" width="40" numeric sortable>
          {{ props.row.cost }}
        </b-table-column>
        <b-table-column field="delete" label="Delete" width="40">
          <b-button type="is-danger" size="is-small" @click="deleteHint(props.row.order)" :disabled="props.row.is_deleting">Delete</b-button>
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
            <p>No hint.</p>
          </div>
        </section>
      </template>
    </b-table>
    <b-modal
      :active.sync="_isNewHintModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <new-hint></new-hint>
    </b-modal>
    <b-modal
      :active.sync="isEditHintModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <edit-hint :hint="clickedHint"></edit-hint>
    </b-modal>
  </div>
</template>

<script>
import NewHint from './New'
import EditHint from './Edit'
import problem from '../../../../../../../api/problem'

export default {
  name: 'HintList',
  props: {
    isNewHintModalActive: Boolean
  },
  components: { NewHint, EditHint },
  data () {
    return {
      isLoading: true,
      isEditHintModalActive: false,
      clickedHint: null,
      currentPage: 1,
      hints: []
    }
  },
  computed: {
    _isNewHintModalActive: {
      get () {
        return this.isNewHintModalActive
      },
      set (value) {
        this.$emit('on-is-new-hint-modal-active-changed', value)
      }
    }
  },
  methods: {
    load () {
      this.isLoading = true
      problem.getHints(this.$route.params.contestID, this.$route.params.problemAlias)
        .then(({data}) => {
          if (data.hints !== null) {
            for (let i = 0; i < data.hints.length; i++) {
              data.hints[i].order = i + 1
              data.hints[i].is_deleting = false
            }
          }
          this.hints = data.hints === null ? [] : data.hints
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: 'Failed to fetch hints. Message: ' + response.data.message,
            type: 'is-danger'
          })
          console.log(response.data)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    deleteHint (order) {
      this.hints[order - 1].is_deleting = true
      problem.deleteHint(this.$route.params.contestID, this.$route.params.problemAlias, order)
        .then(({data}) => {
          this.$buefy.toast.open({
            message: 'Successfully deleted hints',
            type: 'is-success'
          })
          this.load()
        })
        .catch(({response}) => {
          this.hints[order - 1].is_deleting = false
          this.$buefy.toast.open({
            message: 'Failed to delete hints. Message: ' + response.data.message,
            type: 'is-danger'
          })
          console.log(response.data)
        })
    },
    enterModify (row) {
      this.clickedHint = row
      this.isEditHintModalActive = true
    }
  },
  watch: {
    isNewHintModalActive (to, from) {
      if (to === false) {
        this.load()
      }
    },
    isEditHintModalActive (to, from) {
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
