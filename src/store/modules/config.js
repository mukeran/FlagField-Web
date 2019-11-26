import config from '../../api/config'

const state = {
  configs: {}
}

const getters = {}

const actions = {
  load ({commit}) {
    return new Promise(async (resolve, reject) => {
      await config.all()
        .then((res) => {
          commit('setServerError', false, { root: true })
          if (res.data.config === null) {
            res.data.config = {}
          }
          commit('setConfigs', res.data.config)
          resolve(res)
        })
        .catch((err) => {
          if (typeof err.response.data.status === 'undefined') {
            commit('setServerError', true, { root: true })
          } else {
            commit('setServerError', false, { root: true })
          }
          reject(err)
        })
    })
  },
  update ({commit, state}) {
    return new Promise(async (resolve, reject) => {
      await config.modify(state.configs)
        .then((res) => {
          commit('setServerError', false, { root: true })
          resolve(res)
        })
        .catch((err) => {
          if (typeof err.response.data.status === 'undefined') {
            commit('setServerError', true, { root: true })
          } else {
            commit('setServerError', false, { root: true })
          }
          reject(err)
        })
    })
  }
}

const mutations = {
  setConfigs (state, configs) {
    state.configs = configs
  },
  setConfig (state, { key, value }) {
    state.configs[key] = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
