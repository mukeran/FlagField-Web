import constants from '../constants'
import axios from 'axios'

export default {
  getStatistic () {
    return axios.get(`${constants.API_ROOT}/statistic`)
  }
}
