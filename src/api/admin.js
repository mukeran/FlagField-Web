import axios from 'axios'
import constants from '../constants'

export default {
  list () {
    return axios.get(`${constants.API_ROOT}/admin`)
  },
  add (usersID) {
    return axios.post(`${constants.API_ROOT}/admin`, { users_id: usersID })
  },
  delete (usersID) {
    return axios.delete(`${constants.API_ROOT}/admin`, { data: { users_id: usersID } })
  }
}
