import contest from '../../api/contest'

const state = {
  teams: [],
  submissions: [],
  chartOptions: {}
}

const getters = {}

const actions = {
  loadStatistic ({ commit }, { contestID, isPractice }) {
    return new Promise(async (resolve, reject) => {
      await contest.getStatistic(contestID)
        .then((res) => {
          res.data.teams = res.data.teams === null ? [] : res.data.teams
          res.data.submissions = res.data.submissions === null ? [] : res.data.submissions
          commit('setSubmissions', res.data.submissions)
          res.data.teams.sort((a, b) => {
            return (b.points - a.points)
          })
          let prefix = '~FlagField__defaultTeam_'
          if (isPractice) {
            res.data.teams.forEach(val => {
              if (val.name.startsWith(prefix)) {
                val.name = val.name.substr(prefix.length)
              } else {
                console.log('Error! Team name not start with \'~FlagField__defaultTeam_\'')
              }
            })
          }
          commit('setTeams', res.data.teams)
          resolve(res)
        })
        .catch((err) => {
          commit('setSubmissions', [])
          commit('setTeams', [])
          reject(err)
        })
    })
  },
  loadChart ({ state, commit, dispatch }) {
    return new Promise(async (resolve, reject) => {
      let option = {
        title: { text: 'Statistic Chart' },
        tooltip: {
          trigger: 'item',
          formatter: p => `${p.marker}${p.seriesName}<br>Problem: ${p.data[2]}, ${p.data[1]} points<br>${p.data[0].toLocaleString()}`
        },
        legend: {
          data: []
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'time'
        },
        yAxis: {
          type: 'value'
        },
        series: []
      }
      if (state.teams === null || state.submissions === null) {
        commit('setChartOptions', option)
        reject(new Error('loadChart called without preparation!'))
      }
      let teams = state.teams.slice(0, 10)
      let teamNames = []
      let teamIDs = []
      let series = []
      teams.forEach(val => {
        teamNames.push(val.name)
        teamIDs.push(val.id)
        series.push({name: val.name, type: 'line', data: [], score: 0})
      })
      option.legend.data = teamNames
      state.submissions.forEach(val => {
        let ind = teamIDs.indexOf(val.team_id)
        if (ind !== -1) {
          series[ind].score += val.points
          series[ind].data.push([new Date(val.solved_time), series[ind].score, val.problem_alias])
        }
      })
      option.series = series
      commit('setChartOptions', option)
      resolve()
    })
  },
  loadAll ({commit, dispatch}, { contestID, isPractice }) {
    return new Promise(async (resolve, reject) => {
      dispatch('loadStatistic', {contestID: contestID, isPractice: isPractice})
        .then((res) => {
          dispatch('loadChart')
            .then(() => {
              resolve(res)
            })
            .catch((res) => {
              reject(res)
            })
        })
        .catch((res) => {
          reject(res)
        })
    })
  }
}

const mutations = {
  setTeams (state, teams) {
    state.teams = teams
  },
  setSubmissions (state, submissions) {
    state.submissions = submissions
  },
  setChartOptions (state, options) {
    state.chartOptions = options
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
