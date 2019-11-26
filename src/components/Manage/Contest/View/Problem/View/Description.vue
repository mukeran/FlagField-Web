<template>
  <div>
    <b-field grouped group-multiline style="margin-bottom: 10px">
      <button v-if="!isPreviewing" class="button field is-info" @click="isPreviewing = true">
        <b-icon icon="file-find"></b-icon>
        <span>Enter Preview Mode</span>
      </button>
      <button v-if="isPreviewing" class="button field is-info" @click="isPreviewing = false">
        <b-icon icon="code-tags"></b-icon>
        <span>Enter Code Mode</span>
      </button>
    </b-field>
    <codemirror v-if="!isPreviewing" v-model="_description" :options="descriptionCmOptions"></codemirror>
    <div v-if="isPreviewing" class="markdown-body" v-html="renderedDescription"></div>
  </div>
</template>

<script>
import 'codemirror/mode/markdown/markdown'

export default {
  name: 'Description',
  props: {
    description: String
  },
  data () {
    return {
      isPreviewing: false,
      descriptionCmOptions: {
        tabSize: 2,
        mode: 'text/x-markdown',
        theme: 'default',
        lineNumbers: true,
        line: true
      }
    }
  },
  computed: {
    _description: {
      get () {
        return this.description
      },
      set (value) {
        this.$emit('on-description-changed', value)
      }
    },
    renderedDescription () {
      return this.$md.makeHtml(this.description)
    }
  }
}
</script>

<style scoped>

</style>
