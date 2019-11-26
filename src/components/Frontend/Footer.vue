<template>
  <footer id="footer" class="footer">
    <div class="content has-text-centered">
      Powered by <strong><a href="https://github.com/mukeran/FlagField-Web"><b-icon
      icon="flag"
      size="is-small"
      :style="{ color: '#4a4a4a' }"
    ></b-icon>&nbsp;FlagField</a></strong><br>
      Made with <b-icon
      icon="heart"
      size="is-small"
    ></b-icon> by <a href="https://blogs.mukeran.com">mukeran</a>, <a href="https://github.com/am009">am009</a>, <a
      href="https://github.com/Tinywangxx">Tinywangxx</a>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
#footer {
  display: block;
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 3rem 1.5rem 3rem;
}
</style>
