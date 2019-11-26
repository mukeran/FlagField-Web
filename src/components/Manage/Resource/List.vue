<template>
  <section class="section">
    <div class="title-body">
      <p class="title">Resources <button class="button is-primary" @click="isUploadResourceModalActive = true"><b-icon icon="upload"></b-icon><span>Upload</span></button></p>
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
          <b-table-column field="name" label="Name">
            {{ props.row.name }}
          </b-table-column>
          <b-table-column field="content_type" label="Content Type">
            {{ props.row.content_type }}
          </b-table-column>
          <b-table-column field="expired_at" label="Expired At" sortable>
            {{ (new Date(props.row.expired_at)).toLocaleString() }}
          </b-table-column>
          <b-table-column field="created_at" label="Created At" sortable>
            {{ (new Date(props.row.created_at)).toLocaleString() }}
          </b-table-column>
          <b-table-column field="contest_id" label="Contest ID" numuric sortable>
            {{ props.row.contest_id }}
          </b-table-column>
          <b-table-column field="problem_id" label="Problem ID" numuric sortable>
            {{ props.row.problem_id }}
          </b-table-column>
          <b-table-column label="Hidden">
            <b-switch v-model="props.row.is_hidden" @input="updateHidden(props.row.order)" :disabled="props.row.is_updating"></b-switch>
          </b-table-column>
          <b-table-column label="Delete">
            <b-button type="is-danger" size="is-small" @click="deleteSingle(props.row.order)" :disabled="props.row.is_updating">Delete</b-button>
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
    </div>
    <b-modal
      :active.sync="isUploadResourceModalActive"
      has-modal-card
      trap-focus
      :can-cancel="false"
      aria-role="dialog"
      aria-modal>
      <upload-resource></upload-resource>
    </b-modal>
  </section>
</template>

<script>
import UploadResource from './Upload'
import resource from '../../../api/resource'

export default {
  name: 'Resource',
  components: { UploadResource },
  data () {
    return {
      isLoading: false,
      resources: [],
      currentPage: 1,
      isUploadResourceModalActive: false
    }
  },
  methods: {
    load () {
      this.isLoading = true
      resource.listAll()
        .then(({data}) => {
          if (data.resources !== null) {
            for (let i = 0; i < data.resources.length; i++) {
              data.resources[i].order = i
              data.resources[i].is_hidden = typeof data.resources[i].is_hidden === 'undefined' ? false : data.resources[i].is_hidden
              data.resources[i].is_updating = false
            }
            this.resources = data.resources
          } else {
            this.resources = []
          }
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Unable to fetch submission list. Message: ${response.data.message}`,
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
            message: `Successfully changed the hidden status of ${this.resources[order].uuid} to ${this.resources[order].is_hidden}`,
            type: 'is-success'
          })
        })
        .catch(({response}) => {
          this.$buefy.toast.open({
            message: `Failed to change the hidden status of ${this.resources[order].uuid}. Message: ${response.data.message}`,
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.resources[order].is_updating = false
        })
    },
    deleteSingle (order) {
      this.resources[order].is_updating = true
      resource.singleDelete(this.resources[order].uuid)
        .then(() => {
          this.$buefy.toast.open({
            message: `Successfully deleted ${this.resources[order].uuid}`,
            type: 'is-success'
          })
          this.load()
        })
        .catch(({response}) => {
          this.resources[order].is_updating = false
          this.$buefy.toast.open({
            message: `Failed to delete ${this.resources[order].uuid}. Message: ${response.data.message}`,
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
.title {
  font-family: Lato, sans-serif;
  font-weight: normal;
}
.title-body {
  margin-bottom: 30px;
}
</style>
