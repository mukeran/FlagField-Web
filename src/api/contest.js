import axios from 'axios'
import constants from '../constants'

export default {
  list (query) {
    let _query = []
    if (typeof query !== 'undefined') {
      Object.keys(query).forEach(key => {
        _query.push(`${key}=${query[key]}`)
      })
    }
    return axios.get(`${constants.API_ROOT}/contest?${_query.join('&')}`)
  },
  getByID (contestID) {
    return axios.get(`${constants.API_ROOT}/contest/${contestID}`)
  },
  modifyByID (contestID, request) {
    return axios.patch(`${constants.API_ROOT}/contest/${contestID}`, request)
  },
  deleteByID (contestID) {
    return axios.delete(`${constants.API_ROOT}/contest/${contestID}`)
  },
  create (request) {
    return axios.post(`${constants.API_ROOT}/contest`, request)
  },
  getNotificationList (contestID, query) {
    let _query = []
    if (typeof query !== 'undefined') {
      Object.keys(query).forEach(key => {
        _query.push(`${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
      })
    }
    return axios.get(`${constants.API_ROOT}/contest/${contestID}/notification?${_query.join('&')}`)
  },
  addNotification (contestID, content) {
    return axios.post(`${constants.API_ROOT}/contest/${contestID}/notification`, { content })
  },
  singleDeleteNotification (contestID, notificationOrder) {
    return axios.delete(`${constants.API_ROOT}/contest/${contestID}/notification/${notificationOrder}`)
  },
  getStatistic (contestID) {
    return axios.get(`${constants.API_ROOT}/contest/${contestID}/statistic`)
  },
  getTeams (contestID) {
    return axios.get(`${constants.API_ROOT}/contest/${contestID}/team`)
  },
  addTeam (contestID, teamID, members) {
    return axios.post(`${constants.API_ROOT}/contest/${contestID}/team`, { team_id: teamID, members_id: members })
  },
  batchDeleteTeams (contestID, teamsID) {
    return axios.delete(`${constants.API_ROOT}/contest/${contestID}/team`, { data: { teams_id: teamsID } })
  },
  getCurrentTeam (contestID) {
    return axios.get(`${constants.API_ROOT}/contest/${contestID}/team/__current__`)
  },
  leaveContest (contestID) {
    return axios.delete(`${constants.API_ROOT}/contest/${contestID}/team/__current__`)
  }
}
