import team from '../../api/team'
import user from '../../api/user'

const state = {
  teams: null, // A map, teamID => team
  allTeams: [],
  myTeams: [], // API: /user/:my_id/team (after login)
  invitations: [], // This is current user's
  applications: [],
  isNewTeamModalActive: false,
  isTokenModalActive: false,
  isApplicationModalActive: false
}

const getters = {}

const actions = {
  loadTeams ({ commit }) {
    return new Promise(async (resolve, reject) => {
      await team.all().then((res) => {
        if (res.data.teams === null) {
          commit('setAllTeams', [])
          commit('setTeams', new Map())
          resolve()
          return
        }
        commit('setAllTeams', res.data.teams)
        let teams = new Map()
        res.data.teams.forEach((val, key) => {
          teams.set(val.team_id, val)
        })
        commit('setTeams', teams)
        resolve(res)
      }).catch((err) => {
        commit('setTeams', new Map())
        commit('setAllTeams', [])
        reject(err)
      })
    })
  },
  loadMyTeams ({ state, commit, dispatch, rootState }) {
    return new Promise(async (resolve, reject) => {
      if (rootState.session.isLoggedIn === false) {
        console.log('Error: Not logged in.')
        commit('setMyTeams', [])
        resolve()
        return
      }
      let userID = rootState.session.logged.user_id
      await user.getTeamByID(userID, {}).then((res) => {
        if (res.data.teams === null) {
          commit('setMyTeams', [])
          resolve()
          return
        }
        res.data.teams.forEach((val, key) => {
          val.detail = null
        })
        commit('setMyTeams', res.data.teams)
        resolve()
      }).catch((err) => {
        reject(err)
      })
    })
  },
  loadMyTeamDetail ({state, commit, dispatch, rootState}) {
    return new Promise(async (resolve, reject) => {
      let p1 = dispatch('loadTeams')
      let p2 = dispatch('loadMyTeams')
      Promise.all([p1, p2])
        .then(async () => {
          if (state.myTeams === []) {
            console.log('Error: no myTeams')
            resolve()
            return
          }
          let len = state.myTeams.length
          let err1 = null
          for (let i = 0; i < len; i++) {
            await team.getByID(state.myTeams[i].id).then((res) => {
              commit('setMyTeamDetial', {index: i, detail: res.data.team})
            }).catch((err) => {
              err1 = err
            })
          }
          if (err1 !== null) {
            reject(err1)
          }
          resolve()
        }).catch((err) => {
          reject(err)
        })
    })
  },
  loadInvitations ({state, commit, dispatch, rootState}) {
    return new Promise(async (resolve, reject) => {
      if (rootState.session.isLoggedIn === false) {
        console.log('Not logged in.')
        commit('setInvitations', [])
        resolve()
        return
      }
      let userID = rootState.session.logged.user_id
      await user.getInvitationByID(userID).then((res) => {
        if (res.data.invitations === null) {
          commit('setInvitations', [])
          resolve(res)
          return
        }
        commit('setInvitations', res.data.invitations)
        resolve(res)
      }).catch((err) => {
        commit('setInvitations', [])
        reject(err)
      })
    })
  },
  loadApplications ({state, commit, dispatch, rootState}) {
    return new Promise(async (resolve, reject) => {
      if (rootState.session.isLoggedIn === false) {
        console.log('Not logged in.')
        commit('setApplications', [])
        resolve()
        return
      }
      let userID = rootState.session.logged.user_id
      await user.getApplicationByID(userID).then((res) => {
        if (res.data.applications === null) {
          commit('setApplications', [])
          resolve(res)
          return
        }
        commit('setApplications', res.data.applications)
        resolve(res)
      }).catch((err) => {
        commit('setApplications', [])
        reject(err)
      })
    })
  },
  loadAll ({state, commit, dispatch, rootState}) {
    return new Promise(async (resolve, reject) => {
      dispatch('loadTeams')
    })
  }
}

const mutations = {
  setTeams (state, teams) {
    state.teams = teams
  },
  setAllTeams (state, allTeams) {
    state.allTeams = allTeams
  },
  setMyTeams (state, myTeam) {
    state.myTeams = myTeam
  },
  setInvitations (state, m) {
    state.invitations = m
  },
  setApplications (state, m) {
    state.applications = m
  },
  setMyTeamDetial (state, {index: i, detail: d}) {
    state.myTeams[i].detail = d
  },
  setIsNewTeamModalActive (state, m) {
    state.isNewTeamModalActive = m
  },
  setIsApplicationModalActive (state, m) {
    state.isApplicationModalActive = m
  },
  setIsTokenModalActive (state, m) {
    state.isTokenModalActive = m
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
