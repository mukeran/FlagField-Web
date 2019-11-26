<template>
  <div id="app" class="container">
    <Header/>
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './Header'
export default {
  name: 'Frame',
  components: { Header },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      document.title = 'FlagField Manage Panel'
      if (!vm.$store.state.session.isLoggedIn) {
        vm.$router.push({ name: 'login', query: { path: vm.$route.fullPath } })
      } else if (!vm.$store.state.session.logged.is_admin) {
        vm.$router.push({ name: 'index' })
      }
    })
  }
}
</script>

<style>
#app {
  min-height: 100%;
  position: relative;
}
</style>
