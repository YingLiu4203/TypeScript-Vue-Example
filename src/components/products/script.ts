declare let require: any
import Vuex = require('vuex')

import * as types from '../../store/products-types'

export default {
  computed: Vuex.mapGetters({
    products: types.GET_PRODUCTS
  })
}