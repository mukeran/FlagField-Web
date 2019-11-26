import constants from '../constants'
import axios from 'axios'

export default {
  list (query) {
    let _query = []
    if (typeof query !== 'undefined') {
      Object.keys(query).forEach(key => {
        _query.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
      })
    }
    return axios.get(`${constants.API_ROOT}/team?${_query.join('&')}`)
  },
  create (request) {
    return axios.post(`${constants.API_ROOT}/team`, request)
  },
  getByID (teamID) {
    return axios.get(`${constants.API_ROOT}/team/${teamID}`)
  },
  modifyByID (teamID, request) {
    return axios.patch(`${constants.API_ROOT}/team/${teamID}`, request)
  },
  deleteByID (teamID) {
    return axios.delete(`${constants.API_ROOT}/team/${teamID}`)
  },
  getMemberByID (teamID, query) {
    let _query = []
    if (typeof query !== 'undefined') {
      Object.keys(query).forEach(key => {
        _query.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
      })
    }
    return axios.get(`${constants.API_ROOT}/team/${teamID}/user?${_query.join('&')}`)
  },
  addMemberByID (teamID, request) {
    return axios.post(`${constants.API_ROOT}/team/${teamID}/user`, request)
  },
  deleteMemberByID (teamID, request) {
    return axios.delete(`${constants.API_ROOT}/team/${teamID}/user`, { data: request })
  },
  getAdminByID (teamID) {
    return axios.get(`${constants.API_ROOT}/team/${teamID}/admin`)
  },
  addAdminByID (teamID, request) {
    return axios.post(`${constants.API_ROOT}/team/${teamID}/admin`, request)
  },
  deleteAdminByID (teamID, request) {
    return axios.delete(`${constants.API_ROOT}/team/${teamID}/admin`, { data: request })
  },
  getStatisticByID (teamID) {
    return axios.get(`${constants.API_ROOT}/team/${teamID}/statistic`)
  },
  all () {
    return axios.get(`${constants.API_ROOT}/team`)
  },
  getTokenByID (teamID) {
    return axios.get(`${constants.API_ROOT}/team/${teamID}/invitation/token`)
  },
  deleteTokenByID (teamID) {
    return axios.delete(`${constants.API_ROOT}/team/${teamID}/invitation/token`)
  },
  getApplicationByID (teamID) {
    return axios.get(`${constants.API_ROOT}/team/${teamID}/application`)
  },
  sendApplicationByID (teamID) {
    return axios.post(`${constants.API_ROOT}/team/${teamID}/application`)
  },
  cancelApplicationByID (teamID) {
    return axios.delete(`${constants.API_ROOT}/team/${teamID}/application`)
  },
  acceptApplicationByID (teamID, request) {
    return axios.post(`${constants.API_ROOT}/team/${teamID}/application/accept`, request)
  },
  rejectApplicationByID (teamID, request) {
    return axios.post(`${constants.API_ROOT}/team/${teamID}/application/reject`, request)
  },
  getInvitationByID (teamID) {
    return axios.get(`${constants.API_ROOT}/team/${teamID}/invitation`)
  },
  sendInvitationByID (teamID, request) {
    return axios.post(`${constants.API_ROOT}/team/${teamID}/invitation`, request)
  },
  cancelInvitationByID (teamID, request) {
    return axios.delete(`${constants.API_ROOT}/team/${teamID}/invitation`, { data: request })
  },
  acceptInvitationByID (teamID) {
    return axios.get(`${constants.API_ROOT}/team/${teamID}/invitation/accept`)
  },
  acceptInvitationByToken (teamID, request) {
    return axios.post(`${constants.API_ROOT}/team/${teamID}/invitation/accept`, request)
  },
  rejectInvitationByID (teamID) {
    return axios.get(`${constants.API_ROOT}/team/${teamID}/invitation/reject`)
  }
}
