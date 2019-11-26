<template>
  <div id="app" class="container">
    <ServerError></ServerError>
    <Header/>
    <router-view :style="{ paddingBottom: '12rem' }"></router-view>
    <Footer/>
  </div>
</template>

<script>
import ServerError from './ServerError'
import Header from './Header'
import Footer from './Footer'
export default {
  name: 'Frame',
  components: { ServerError, Header, Footer }
}
</script>

<style>
#app {
  min-height: 100%;
  position: relative;
}
</style>
