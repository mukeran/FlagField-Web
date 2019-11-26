import constants from '../constants'
import axios from 'axios'

export default {
  list () {
    return axios.get(`${constants.API_ROOT}/notification`)
  },
  read (notificationID) {
    return axios.patch(`${constants.API_ROOT}/notification/${notificationID}`)
  },
  all (query) {
    let _query = []
    Object.keys(query).forEach(key => {
      _query.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
    })
    return axios.get(`${constants.API_ROOT}/notification?${_query.join('&')}`)
  },
  delete (request) {
    return axios.delete(`${constants.API_ROOT}/notification`, { data: request })
  },
  create (request) {
    return axios.post(`${constants.API_ROOT}/notification`, request)
  }
}
