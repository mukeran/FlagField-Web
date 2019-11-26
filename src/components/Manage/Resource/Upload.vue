<template>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Upload Resources</p>
      <button class="delete" aria-label="close" @click="$parent.close()"></button>
    </header>
    <section class="modal-card-body">
      <b-field label="File" label-position="on-border" position="is-centered" v-show="!isUploading && !isUploaded">
          <b-upload
            v-model="files"
            multiple
            drag-drop
            expanded
            @input="update">
            <section class="section">
              <div class="content has-text-centered">
                <p>
                  <b-icon
                    icon="upload"
                    size="is-large">
                  </b-icon>
                </p>
                <p>Drop your files here or click to upload</p>
              </div>
            </section>
          </b-upload>
      </b-field>
      <b-table
        :data="tableFiles"
        striped
        hoverable>
        <template slot-scope="props">
          <b-table-column field="name" label="Name">
            {{ props.row.name }}
          </b-table-column>
          <b-table-column field="type" label="Type">
            {{ props.row.type }}
          </b-table-column>
          <b-table-column field="size" label="Size">
            {{ props.row.size }}
          </b-table-column>
          <b-table-column field="status" label="Status">
            <template v-if="isUploading">
              <template v-if="props.row.status === 0">
                <span :key="0">Pending</span>
              </template>
              <template v-else-if="props.row.status === 1">
                <b-progress
                  :key="1"
                  :value="uploadProgress"
                  :max="100"
                  :show-value="true"
                  format="percent"
                  :keep-trailing-zeroes="false"></b-progress>
              </template>
              <template v-else-if="props.row.status === 2">
                <span :key="2">{{ props.row.uuid }}</span>
              </template>
              <template v-else>
                <span :key="3">Failed</span>
              </template>
            </template>
            <template v-else>
              <b-button type="is-danger" size="is-small" @click="() => { files.splice(props.index, 1); tableFiles.splice(props.index, 1) }">Remove</b-button>
            </template>
          </b-table-column>
        </template>
        <template slot="empty">
          <section class="section">
            <div class="content has-text-grey has-text-centered">
              <p>
                <b-icon
                  icon="emoticon-cool"
                  size="is-large">
                </b-icon>
              </p>
              <p>Add files above.</p>
            </div>
          </section>
        </template>
      </b-table>
    </section>
    <footer class="modal-card-foot" style="justify-content: flex-end">
      <template v-if="!isUploaded">
        <button class="button" @click="$parent.close()" :disabled="isUploading">Cancel</button>
        <button class="button is-primary" @click="upload" :disabled="isUploading">Upload</button>
      </template>
      <template v-else>
        <button class="button is-primary" @click="$parent.close()">Finish</button>
      </template>
    </footer>
  </div>
</template>

<script>
import resource from '../../../api/resource'

export default {
  name: 'ResourceUpload',
  data () {
    return {
      isUploading: false,
      isUploaded: false,
      files: [],
      tableFiles: [],
      currentUploading: 0,
      uploadProgress: 0
    }
  },
  methods: {
    update (file) {
      this.tableFiles = []
      if (file instanceof Array) {
        for (let i = 0; i < file.length; i++) {
          this.tableFiles.push({
            name: file[i].name,
            type: file[i].type,
            size: file[i].size,
            status: 0,
            uuid: ''
          })
        }
      } else {
        this.tableFiles.push({
          name: file.name,
          type: file.type,
          size: file.size,
          status: 0,
          uuid: ''
        })
      }
    },
    async upload () {
      this.isUploading = true
      for (let i = 0; i < this.files.length; i++) {
        this.currentUploading = i
        let formData = new FormData()
        formData.append('file', this.files[i])
        this.uploadProgress = 0
        this.tableFiles[i].status = 1
        await resource.upload(formData, e => {
          this.uploadProgress = Math.floor((e.loaded / e.total) * 100)
        })
          .then(({data}) => {
            this.tableFiles[i].uuid = data.uuid
            this.tableFiles[i].status = 2
          })
          .catch(({response}) => {
            this.tableFiles[i].status = 3
            console.log(response.data)
          })
      }
      this.isUploaded = true
    }
  }
}
</script>

<style>
.upload-draggable {
  width: 100%;
}
.upload {
  width: 100%;
}
</style>
