import axios from 'axios'
import constants from '../constants'

export default {
  resume () {
    return axios.get(`${constants.API_ROOT}/session/__current__`)
  },
  create (request) {
    return axios.post(`${constants.API_ROOT}/session`, request)
  },
  destroy () {
    return axios.delete(`${constants.API_ROOT}/session`)
  },
  // require admin
  all () {
    return axios.get(`${constants.API_ROOT}/session`)
  }
}
