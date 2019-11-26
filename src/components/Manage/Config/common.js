export const mapConfig = (names) => {
  let computed = {}
  Object.keys(names).forEach((key) => {
    computed[key] = {
      get () {
        if (!this.$store.state.config.configs.hasOwnProperty(names[key])) {
          this.$store.commit('config/setConfig', { key: names[key], value: '' })
        }
        return this.$store.state.config.configs[names[key]]
      },
      set (value) {
        this.$store.commit('config/setConfig', { key: names[key], value: value })
      }
    }
  })
  return computed
}

export const mapConfigSwitch = (names) => {
  let computed = {}
  Object.keys(names).forEach((key) => {
    computed[key] = {
      get () {
        if (!this.$store.state.config.configs.hasOwnProperty(names[key])) {
          this.$store.commit('config/setConfig', { key: names[key], value: '0' })
        }
        if (this.$store.state.config.configs[names[key]] === '0') {
          return false
        }
        return true
      },
      set (value) {
        if (value === false) {
          value = '0'
        } else {
          value = '1'
        }
        this.$store.commit('config/setConfig', { key: names[key], value: value })
      }
    }
  })
  return computed
}
