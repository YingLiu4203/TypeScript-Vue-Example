declare let require: any

import './styles/style.scss'

import Vue = require('vue')
let App = require('./App.vue').default
import store from './store'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})