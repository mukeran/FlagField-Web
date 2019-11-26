import axios from 'axios'
import constants from '../constants'

export default {
  listAll () {
    return axios.get(`${constants.API_ROOT}/resource`)
  },
  listContest (contestID) {
    return axios.get(`${constants.API_ROOT}/resource?contest_id=${contestID}`)
  },
  listProblem (contestID, problemAlias) {
    return axios.get(`${constants.API_ROOT}/resource?contest_id=${contestID}&problem_alias=${problemAlias}`)
  },
  upload (formData, onUploadProgress) {
    return axios.post(`${constants.API_ROOT}/resource`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: onUploadProgress
    })
  },
  modify (resourceUUID, request) {
    return axios.patch(`${constants.API_ROOT}/resource/${resourceUUID}`, request)
  },
  singleDelete (resourceUUID) {
    return axios.delete(`${constants.API_ROOT}/resource/${resourceUUID}`)
  }
}
