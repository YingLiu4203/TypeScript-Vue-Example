import { GET_PRODUCTS } from '../../products-types'

export const getters = {
  [GET_PRODUCTS] (state) {
    return state.products
  }
}