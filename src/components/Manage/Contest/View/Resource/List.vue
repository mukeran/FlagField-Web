<template>
  <div>
    <b-table
      :data="resources"
      striped
      hoverable
      paginated
      pagination-position="bottom"
      :pagination-simple="true"
      :per-page="10"
      :current-page.sync="currentPage"
      :loading="isLoading">
      <template slot-scope="props">
        <b-table-column field="uuid" label="UUID">
          {{ props.row.uuid }}
        </b-table-column>
        <b-table-column field="name" label="Name" sortable>
          {{ props.row.name }}
        </b-table-column>
        <b-table-column field="contentType" label="Content Type">
          {{ props.row.content_type }}
        </b-table-column>
        <b-table-column field="expiredAt" label="Expired At">
          {{ (new Date(props.row.expired_at)).toLocaleString() }}
        </b-table-column>
        <b-table-column field="belongTo" label="Belong To">
          <template v-if="props.row.problem_id === 0">
            <template v-if="isPractice">Practice</template>
            <template v-else>Contest</template>
          </template>
          <template v-else>Problem</template>
        </b-table-column>
        <b-table-column field="hidden" label="Hidden" width="40">
          <b-switch v-model="props.row.is_hidden" size="is-small" @input="updateHidden(props.row.order)" :disabled="props.row.is_updating"></b-switch>
        </b-table-column>
        <b-table-column field="delete" label="Delete" width="40">
          <b-button type="is-danger" size="is-small" @click="deleteResource(props.row.order)" :disabled="props.row.is_updating">Delete</b-button>
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
            <p>No resource here.</p>
          </div>
        </section>
      </template>
    </b-table>
    <b-modal
      :active.sync="_isUploadResourceModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <upload-resource></upload-resource>
    </b-modal>
  </div>
</template>

<script>
import UploadResource from './Upload'
import resource from '../../../../../api/resource'

export default {
  name: 'ResourceList',
  components: { UploadResource },
  props: {
    isUploadResourceModalActive: Boolean
  },
  data () {
    return {
      isLoading: true,
      resources: [],
      currentPage: 1
    }
  },
  computed: {
    isPractice () {
      return this.$route.params.contestID === '__practice__' || this.$route.params.contestID === 1
    },
    _isUploadResourceModalActive: {
      get () {
        return this.isUploadResourceModalActive
      },
      set (value) {
        this.$emit('on-is-upload-resource-modal-active-changed', value)
      }
    }
  },
  methods: {
    load () {
      this.isLoading = true
      resource.listContest(this.$route.params.contestID)
        .then(({data}) => {
          if (data.resources !== null) {
            for (let i = 0; i < data.resources.length; i++) {
              data.resources[i].is_updating = false
              data.resources[i].order = i
              if (typeof data.resources[i].is_hidden === 'undefined') {
                data.resources[i].is_hidden = false
              }
            }
            this.resources = data.resources
          } else {
            this.resources = []
          }
        })
        .catch(() => {
          this.resources = []
          this.$buefy.toast.open({
            message: 'Failed to fetch resources',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    updateHidden (order) {
      this.resources[order].is_updating = true
      resource.modify(this.resources[order].uuid, {
        is_hidden: this.resources[order].is_hidden
      })
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully changed the hidden status of resource ${this.resources[order].uuid}`,
            type: 'is-success'
          })
        })
        .catch(() => {
          this.$buefy.toast.open({
            message: `Failed to change the hidden status of resource ${this.resources[order].uuid}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.resources[order].is_updating = false
        })
    },
    deleteResource (order) {
      this.resources[order].is_updating = true
      resource.singleDelete(this.resources[order].uuid)
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully deleted resource ${this.resources[order].uuid}`,
            type: 'is-success'
          })
          this.load()
        })
        .catch(({response}) => {
          this.resources[order].is_updating = false
          this.$buefy.toast.open({
            message: `Failed to delete resource ${this.resources[order].uuid}. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
    }
  },
  watch: {
    isUploadResourceModalActive (to, from) {
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

<style scoped>

</style>
