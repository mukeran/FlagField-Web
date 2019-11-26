<template>
  <div>
    <add-member-modal :is-modal-active.sync="_isMemberModalActive" :teamID="teamID" @updated="load"/>
    <br>
    <div class="level">
      <div class="level-left">
        <b-field grouped group-multiline>
          <button class="button field" @click="checked = []" :disabled="!checked.length">Uncheck</button>
          <button class="button field is-danger" :disabled="!checked.length" @click="deleteChecked">Delete</button>
          <button class="button field is-primary" :disabled="!checked.length" @click="addAsAdmin">Add Admin</button>
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
      :data="members"
      :columns="memberColumns"
      :checked-rows.sync="checked"
      :loading="isLoadingMember"
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
          <button class="button field is-primary" :disabled="!checked.length" @click="addAsAdmin">Add Admin</button>
        </b-field>
      </template>
    </b-table>
  </div>
</template>

<script>
import team from '../../../../../api/team'
import AddMemberModal from './AddMember'
export default {
  name: 'ManageTeamMember',
  components: {AddMemberModal},
  props: ['teamID', 'isMemberModalActive'],
  data () {
    return {
      isLoadingMember: false,
      members: [],
      checked: [],
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
  computed: {
    _isMemberModalActive: {
      get () {
        return this.isMemberModalActive
      },
      set (value) {
        this.$emit('update:isMemberModalActive', value)
      }
    }
  },
  methods: {
    clear () {
      this.members = []
      this.checked = []
    },
    load () {
      this.clear()
      this.isLoadingMember = true
      team.getMemberByID(this.teamID, {}).then((res) => {
        this.members = res.data.members === null ? [] : res.data.members
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      }).finally(() => {
        this.isLoadingMember = false
      })
    },
    deleteChecked () {
      let data = { users_id: [] }
      this.checked.forEach((val, key) => {
        data.users_id.push(val.id)
      })
      team.deleteMemberByID(this.teamID, data).then((res) => {
        this.$buefy.toast.open({
          message: res.data.message,
          type: 'is-success'
        })
        this.load()
      }).catch((err) => {
        this.$store.dispatch('session/informConnectionError', err)
      })
    },
    addAsAdmin () {
      let data = {users_id: []}
      this.checked.forEach((val, key) => {
        data.users_id.push(val.id)
      })
      team.addAdminByID(this.teamID, data).then((res) => {
        this.$buefy.toast.open({
          message: 'Added Successfully',
          type: 'is-success'
        })
        this.$emit('adminChanged')
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
