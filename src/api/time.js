import constants from '../constants'
import axios from 'axios'

export default {
  time () {
    return axios.get(`${constants.API_ROOT}/time`)
  }
}
