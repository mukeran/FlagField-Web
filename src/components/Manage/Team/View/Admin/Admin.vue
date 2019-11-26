<template>
  <div>
    <div class="level">
      <div class="level-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checked = []" :disabled="!checked.length">Uncheck</button>
          <button class="button field is-danger" :disabled="!checked.length" @click="deleteChecked">Delete</button>
        </b-field>
      </div>
    </div>
    <b-table
      :data="admins"
      :columns="adminColumns"
      :checked-rows.sync="checked"
      :loading="isLoadingAdmin"
      pagination-simple
      paginated
      per-page=5
      current-page.sync=1
      pagination-position="bottom"
      checkable>
      <template slot="empty">
        <section class="section">
          <div class="content has-text-grey has-text-centered">
            <p>
              <b-icon
                icon="emoticon-sad"
                size="is-large">
              </b-icon>
            </p>
            <p>Nothing here.</p>
          </div>
        </section>
      </template>
      <template slot="bottom-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checked = []" :disabled="!checked.length">Uncheck</button>
          <button class="button field is-danger" :disabled="!checked.length" @click="deleteChecked">Delete</button>
        </b-field>
      </template>
    </b-table>
  </div>
</template>

<script>
import team from '../../../../../api/team'
export default {
  name: 'ManageTeamAdmin',
  props: {
    teamID: Number
  },
  data () {
    return {
      isLoadingAdmin: false,
      admins: [],
      checked: [],
      adminColumns: [
        {
          field: 'user_id',
          label: 'ID',
          width: '40',
          numeric: true
        },
        {
          field: 'username',
          label: 'Name'
        }
      ]
    }
  },
  methods: {
    clear () {
      this.admins = []
      this.checked = []
    },
    load () {
      this.clear()
      this.isLoadingAdmin = true
      team.getAdminByID(this.teamID).then((res) => {
        this.admins = res.data.admins
        if (this.admins === null) {
          this.admins = []
        }
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      }).finally(() => {
        this.isLoadingAdmin = false
      })
    },
    deleteChecked () {
      let data = {users_id: []}
      this.checked.forEach((val, key) => {
        data.users_id.push(val.user_id)
      })
      team.deleteAdminByID(this.teamID, data).then((res) => {
        this.$buefy.toast.open({
          message: 'Deleted successfully',
          type: 'is-success'
        })
        this.load()
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
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

</style>
