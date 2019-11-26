import constants from '../constants'
import axios from 'axios'

export default {
  create (request) {
    return axios.post(`${constants.API_ROOT}/user`, request)
  },
  getByID (userID) {
    return axios.get(`${constants.API_ROOT}/user/${userID}`)
  },
  deleteByID (userID) {
    return axios.delete(`${constants.API_ROOT}/user/${userID}`)
  },
  list () {
    return axios.get(`${constants.API_ROOT}/user`)
  },
  modifyPasswordByID (userID, request) {
    return axios.put(`${constants.API_ROOT}/user/${userID}/password`, request)
  },
  modifyEmailByID (userID, request) {
    return axios.put(`${constants.API_ROOT}/user/${userID}/email`, request)
  },
  modifyProfileByID (userID, request) {
    return axios.patch(`${constants.API_ROOT}/user/${userID}/profile`, request)
  },
  getTeamByID (userID, query) {
    let _query = []
    if (typeof query !== 'undefined') {
      Object.keys(query).forEach(key => {
        _query.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
      })
    }
    return axios.get(`${constants.API_ROOT}/user/${userID}/team?${_query.join('&')}`)
  },
  getInvitationByID (userID) {
    return axios.get(`${constants.API_ROOT}/user/${userID}/team/invitation`)
  },
  getApplicationByID (userID) {
    return axios.get(`${constants.API_ROOT}/user/${userID}/team/application`)
  }
}
