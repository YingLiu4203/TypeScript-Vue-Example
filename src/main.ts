import * as Vue from 'vue'
import App from './App'

import './styles/style.scss'

import store from './store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})