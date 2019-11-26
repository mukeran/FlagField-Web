<template>
  <section>
    <b-notification
      type="is-danger"
      :active.sync="isServerError"
      has-icon
      :closable="false"
      role="alert">
      Unable to connect FlagField-Server.<br>
      Please check your network or contact administrator.
    </b-notification>
  </section>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ServerError',
  computed: {
    ...mapState({
      isServerError: state => state.isServerError
    })
  }
}
</script>

<style scoped>

</style>
