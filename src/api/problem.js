import axios from 'axios'
import constants from '../constants'

export default {
  list (contestID) {
    return axios.get(`${constants.API_ROOT}/contest/${contestID}/problem`)
  },
  create (contestID, request) {
    return axios.post(`${constants.API_ROOT}/contest/${contestID}/problem`, request)
  },
  getByAlias (contestID, problemAlias) {
    return axios.get(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}`)
  },
  modifyByAlias (contestID, problemAlias, request) {
    return axios.patch(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}`, request)
  },
  deleteByAlias (contestID, problemAlias) {
    return axios.delete(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}`)
  },
  getHints (contestID, problemAlias) {
    return axios.get(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}/hint`)
  },
  getHint (contestID, problemAlias, hintOrder) {
    return axios.get(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}/hint/${hintOrder}`)
  },
  deleteHint (contestID, problemAlias, hintOrder) {
    return axios.delete(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}/hint/${hintOrder}`)
  },
  modifyHint (contestID, problemAlias, hintOrder, request) {
    return axios.patch(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}/hint/${hintOrder}`, request)
  },
  newHint (contestID, problemAlias, request) {
    return axios.post(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}/hint`, request)
  },
  submitFlag (contestID, problemAlias, flag) {
    return axios.post(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}/submission`, { flag: flag })
  },
  getFlags (contestID, problemAlias) {
    return axios.get(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}/flag`)
  },
  newFlag (contestID, problemAlias, request) {
    return axios.post(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}/flag`, request)
  },
  modifyFlag (contestID, problemAlias, flagOrder, request) {
    return axios.patch(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}/flag/${flagOrder}`, request)
  },
  batchDeleteFlags (contestID, problemAlias, orders) {
    return axios.delete(`${constants.API_ROOT}/contest/${contestID}/problem/${problemAlias}/flag`, { data: { orders: orders } })
  }
}
