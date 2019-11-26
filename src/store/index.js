import Vue from 'vue'
import Vuex from 'vuex'
import config from './modules/config'
import session from './modules/session'
import contest from './modules/contest'
import team from './modules/team'
import statistic from './modules/statistic'
import mutations from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    config,
    session,
    contest,
    team,
    statistic
  },
  state: {
    isServerError: false
  },
  mutations,
  strict: debug
})
