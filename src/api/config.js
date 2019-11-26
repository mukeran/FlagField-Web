import constants from '../constants'
import axios from 'axios'

export default {
  all () {
    return axios.get(`${constants.API_ROOT}/config`)
  },
  modify (request) {
    return axios.patch(`${constants.API_ROOT}/config`, request)
  },
  get (configString) {
    return axios.get(`${constants.API_ROOT}/config/${configString}`)
  }
}
