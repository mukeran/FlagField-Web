// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import showdown from 'showdown'
import cryptoJS from 'crypto-js'
import router from './router'
import constants from './constants'
import store from './store'
import '@mdi/font/css/materialdesignicons.css'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/dataZoomInside'
import 'echarts/lib/component/dataZoomSelect'
import 'echarts/lib/component/dataZoomSlider'
import 'lato-font/css/lato-font.css'
import 'github-markdown-css/github-markdown.css'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.config.productionTip = false
Vue.use(Buefy)
Vue.prototype.$http = axios
Vue.prototype.$const = constants
showdown.setFlavor('github')
Vue.prototype.$md = new showdown.Converter({ tables: true })
Vue.prototype.$crypto = cryptoJS
Vue.component('v-chart', ECharts)
Vue.use(VueCodemirror)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
