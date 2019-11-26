import constants from '../constants'
import axios from 'axios'

export default {
  email (request) {
    return axios.post(
      `${constants.API_ROOT}/captcha/email`,
      request
    )
  }
}
