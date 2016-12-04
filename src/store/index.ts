declare let require: any
declare let process: any

import Vue = require('vue')
import Vuex = require('vuex')

import products from './modules/products'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    products
  },
  strict: debug
})
