import contest from '../../api/contest'
import problem from '../../api/problem'
import constants from '../../constants'

const state = {
  list: [],
  isNotFound: false,
  isRegisterModalActive: false,
  isLoading: true,
  isProblemLoading: true,
  isCurrentTeamLoading: true,
  isNotificationLoading: true,
  isRealtimeNotificationLoading: true,
  active: null,
  activeStatus: 0,
  problems: new Map(),
  problemCount: 0,
  problemTypes: new Set(),
  solvedProblems: new Set(),
  activeProblem: null,
  activeHints: [],
  notifications: [],
  isNotParticipated: false,
  currentTeam: null,
  isTeamAdmin: false,
  currentTeamSubmissions: []
}

const getters = {}

const actions = {
  loadList ({ commit }) {
    return new Promise((resolve, reject) => {
      contest.list()
        .then((res) => {
          commit('setList', res.data.contests === null ? [] : res.data.contests)
          resolve(res)
        })
        .catch((err) => {
          commit('setList', [])
          reject(err)
        })
    })
  },
  load ({ commit }, { contestID }) {
    return new Promise((resolve, reject) => {
      contest.getByID(contestID)
        .then((res) => {
          commit('setActive', res.data.contest)
          commit('setIsNotFound', false)
          commit('updateActiveStatus')
          resolve(res)
        })
        .catch((err) => {
          if (typeof err.response.data.status !== 'undefined') {
            if (err.response.data.status === constants.status.NOT_FOUND) {
              commit('setActive', null)
              commit('setIsNotFound', true)
              commit('setActiveStatus', 0)
            }
          }
          reject(err)
        })
    })
  },
  loadProblems ({ commit }, { contestID }) {
    return new Promise((resolve, reject) => {
      problem.list(contestID)
        .then((res) => {
          let problems = new Map()
          let types = new Set()
          let length = 0
          if (res.data.problems !== null) {
            length = res.data.problems.length
            res.data.problems.forEach((value, key) => {
              problems.set(value.alias, value)
              types.add(value.type)
            })
          }
          commit('setProblems', { problems: problems, count: length, types: types })
          resolve(res)
        })
        .catch((err) => {
          commit('setProblems', { problems: new Map(), count: 0, types: new Set() })
          reject(err)
        })
    })
  },
  loadCurrentTeam ({ commit }, { contestID }) {
    return new Promise((resolve, reject) => {
      contest.getCurrentTeam(contestID)
        .then((res) => {
          commit('setIsNotParticipated', false)
          commit('setCurrentTeam', res.data.team)
          commit('setIsTeamAdmin', res.data.is_admin)
          commit('setCurrentTeamSubmissions', typeof res.data.submissions === 'undefined' ? [] : res.data.submissions)
          resolve(res)
        })
        .catch((err) => {
          if (typeof err.response.data.status !== 'undefined') {
            if (err.response.data.status === constants.status.NOT_FOUND) {
              commit('setIsNotParticipated', true)
              commit('setCurrentTeam', null)
              commit('setIsTeamAdmin', false)
              commit('setCurrentTeamSubmissions', [])
            }
          }
          reject(err)
        })
    })
  },
  loadNotifications ({ commit }, { contestID }) {
    return new Promise((resolve, reject) => {
      contest.getNotificationList(contestID)
        .then((res) => {
          commit('setNotifications', res.data.notifications === null ? [] : res.data.notifications)
          resolve(res)
        })
        .catch((err) => {
          commit('setNotifications', [])
          reject(err)
        })
    })
  },
  activateProblem ({ commit }, { contestID, problemAlias }) {
    return new Promise((resolve, reject) => {
      problem.getByAlias(contestID, problemAlias)
        .then((res) => {
          commit('setActiveProblem', res.data.problem)
          resolve(res)
        })
        .catch((err) => {
          commit('setActiveProblem', null)
          reject(err)
        })
    })
  },
  activateHints ({ commit }, { contestID, problemAlias }) {
    return new Promise((resolve, reject) => {
      problem.getHints(contestID, problemAlias)
        .then((res) => {
          if (res.data.hints !== null) {
            for (let i = 0; i < res.data.hints.length; i++) {
              res.data.hints[i].is_showing = false
              res.data.hints[i].is_loading = false
            }
          }
          commit('setActiveHints', res.data.hints === null ? [] : res.data.hints)
          resolve(res)
        })
        .catch((err) => {
          commit('setActiveHints', [])
          reject(err)
        })
    })
  },
  unlockHint ({ commit }, { contestID, problemAlias, hintOrder }) {
    return new Promise((resolve, reject) => {
      commit('loadingActiveHint', { order: hintOrder, status: true })
      problem.getHint(contestID, problemAlias, hintOrder)
        .then((res) => {
          res.data.hint.is_showing = false
          res.data.hint.is_loading = false
          commit('updateActiveHints', { order: hintOrder, hint: res.data.hint })
          resolve(res)
        })
        .catch((err) => {
          commit('loadingActiveHint', { order: hintOrder, status: false })
          reject(err)
        })
    })
  },
  loadAll ({ commit, dispatch }, { contestID }) {
    let p1 = dispatch('load', { contestID: contestID })
    let p2 = dispatch('loadProblems', { contestID: contestID })
    let p3 = dispatch('loadCurrentTeam', { contestID: contestID })
    let p4 = dispatch('loadNotifications', { contestID: contestID })
    return Promise.all([p1, p2, p3, p4]).then(() => { commit('updateSolvedProblems') })
  }
}

const mutations = {
  setList (state, contests) {
    state.list = contests
  },
  setIsNotFound (state, isNotFound) {
    state.isNotFound = isNotFound
  },
  setIsRegisterModalActive (state, isRegisterModalActive) {
    state.isRegisterModalActive = isRegisterModalActive
  },
  setIsLoading (state, isLoading) {
    state.isLoading = isLoading
  },
  setIsProblemLoading (state, isLoading) {
    state.isProblemLoading = isLoading
  },
  setIsCurrentTeamLoading (state, isLoading) {
    state.isCurrentTeamLoading = isLoading
  },
  setIsNotificationLoading (state, isLoading) {
    state.isNotificationLoading = isLoading
  },
  setIsRealtimeNotificationLoading (state, isLoading) {
    state.isRealtimeNotificationLoading = isLoading
  },
  setActive (state, contest) {
    state.active = contest
  },
  setProblems (state, { problems, count, types }) {
    state.problems = problems
    state.problemCount = count
    state.problemTypes = types
  },
  updateSolvedProblems (state) {
    state.solvedProblems.clear()
    state.currentTeamSubmissions.forEach((value) => {
      state.solvedProblems.add(value.problem_alias)
    })
  },
  addSolvedProblem (state, { alias }) {
    state.solvedProblems.add(alias)
  },
  setActiveProblem (state, problem) {
    state.activeProblem = problem
  },
  setActiveHints (state, hints) {
    state.activeHints = hints
  },
  updateActiveHints (state, { order, hint }) {
    state.activeHints[order - 1].cost = hint.cost
    state.activeHints[order - 1].content = hint.content
    state.activeHints[order - 1].is_unlocked = hint.is_unlocked
    state.activeHints[order - 1].is_showing = hint.is_showing
    state.activeHints[order - 1].is_loading = hint.is_loading
  },
  toggleActiveHint (state, order) {
    state.activeHints[order - 1].is_showing = !state.activeHints[order - 1].is_showing
  },
  loadingActiveHint (state, { order, status }) {
    state.activeHints[order - 1].is_loading = status
  },
  setNotifications (state, notifications) {
    state.notifications = notifications
  },
  setIsNotParticipated (state, isNotParticipated) {
    state.isNotParticipated = isNotParticipated
  },
  setCurrentTeam (state, currentTeam) {
    state.currentTeam = currentTeam
  },
  setIsTeamAdmin (state, isTeamAdmin) {
    state.isTeamAdmin = isTeamAdmin
  },
  setCurrentTeamSubmissions (state, currentTeamSubmissions) {
    state.currentTeamSubmissions = currentTeamSubmissions
  },
  clearState (state) {
    state.isLoading = true
    state.isProblemLoading = true
    state.isCurrentTeamLoading = true
    state.isNotificationLoading = true
    state.isRealtimeNotificationLoading = true
    state.active = null
    state.problems = new Map()
    state.problemCount = 0
    state.problemTypes = new Set()
    state.solvedProblems = new Set()
    state.activeProblem = null
    state.activeHints = []
    state.notifications = []
    state.currentTeam = null
    state.isTeamAdmin = false
    state.currentTeamSubmissions = []
  },
  setActiveStatus (state, status) {
    this.activeStatus = status
  },
  updateActiveStatus (state) {
    let startTime = new Date(state.active.start_time)
    let endTime = new Date(state.active.end_time)
    let currentTime = new Date()
    if (startTime > currentTime) {
      state.activeStatus = 0
    } else if (startTime <= currentTime && currentTime <= endTime) {
      state.activeStatus = 1
    } else {
      state.activeStatus = 2
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
