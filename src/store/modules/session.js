import session from '../../api/session'
import constants from '../../constants'
import { ToastProgrammatic as Toast } from 'buefy'

const state = {
  isLoggedIn: false,
  logged: null
}

const getters = {}

const actions = {
  login ({ commit }, request) {
    return new Promise(async (resolve, reject) => {
      await session.create(request).then((res) => {
        commit('setLogged', res.data.session)
        commit('setServerError', false, { root: true })
        resolve(res)
      }).catch((err) => {
        let res = err.response
        commit('setNotLogged')
        if (typeof (res.data.status) === 'undefined' || res.data.status === constants.status.SERVER_ERROR) {
          commit('setServerError', true, { root: true })
        } else {
          commit('setServerError', false, { root: true })
          reject(err)
        }
      })
    })
  },
  logout ({ state, commit }) {
    return new Promise(async (resolve, reject) => {
      if (state.isLoggedIn) {
        await session.destroy().then((res) => {
          commit('setNotLogged')
          commit('setServerError', false, { root: true })
          resolve(res)
        }).catch((err) => {
          let res = err.response
          if (typeof (res.data.status) === 'undefined' || res.data.status === constants.status.SERVER_ERROR) {
            commit('setServerError', true, { root: true })
          } else {
            commit('setServerError', false, { root: true })
            reject(err)
          }
        })
      }
    })
  },
  resume ({ commit }) {
    return new Promise(async (resolve, reject) => {
      await session.resume().then((res) => {
        commit('setLogged', res.data.session)
        commit('setServerError', false, { root: true })
        resolve(res)
      }).catch((err) => {
        let res = err.response
        commit('setNotLogged')
        if (typeof (res) === 'undefined' || typeof (res.data.status) === 'undefined' || res.data.status === constants.status.SERVER_ERROR) {
          commit('setServerError', true, { root: true })
          // console.log(res)
        } else {
          commit('setServerError', false, { root: true })
          // console.log(res)
          // console.log(err.message)
        }
        resolve(err) // stop error from throwing out to console
      })
    })
  },
  informConnectionError ({commit}, err) {
    // console.log('err:', err.response)
    if (typeof (err.response) === 'undefined') { // no internet
      Toast.open({
        message: `Failed to connect server.`,
        type: 'is-danger'
      })
      return
    }
    let res = err.response.data
    if (typeof (res.status) !== 'undefined') { // server HTTP status code error
      Toast.open({
        message: `Error occurs when request. ${res.status}, ${res.message}`,
        type: 'is-danger'
      })
    } else { // proxy response
      Toast.open({
        message: 'Error: ' + (err.response.data || err.message),
        type: 'is-danger'
      })
    }
  },
  informError ({ state }, err) {
    // console.log('err', err.response)
    if (typeof err.response.data.status !== 'undefined') {
      let status = err.response.data.status
      Toast.open({
        message: `Error occurs when request. ${status}`,
        type: 'is-danger'
      })
    } else {
      Toast.open({
        message: `Failed to connect server.`,
        type: 'is-danger'
      })
    }
  },
  informLoginFirst ({ state }, res) {
    if (!(state.isLoggedIn)) {
      Toast.open({
        message: 'Please log in first!',
        type: 'is-danger'
      })
    }
  }
}

const mutations = {
  setLogged (state, session) {
    state.logged = session
    state.isLoggedIn = true
  },
  setNotLogged (state) {
    state.logged = null
    state.isLoggedIn = false
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
