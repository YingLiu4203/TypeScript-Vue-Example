import { getters } from './getters'

const initialState = {
  products: [
    {
      id: '001',
      name: 'COBOL 101 vintage',
      description: 'Learn COBOL with this vintage programming book',
      price: 399,
    },
    {
      id: '007',
      name: 'Sharp C2719 curved TV',
      description: 'Watch TV like with new screen technology',
      price: 1995,
    },
    {
      id: '719',
      name: 'Remmington X mechanical keyboard',
      description: 'Excellent for gaming and typing',
      price: 595,
    }
  ]
}

export default {
  state: {
    ...initialState
  },
  getters
}