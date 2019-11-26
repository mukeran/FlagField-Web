import axios from 'axios'
import constants from '../constants'

export default {
  list () {
    return axios.get(`${constants.API_ROOT}/submission`)
  }
}
