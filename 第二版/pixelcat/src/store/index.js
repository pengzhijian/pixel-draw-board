import { createStore } from 'vuex'
import color from './color.js'

export default createStore({
  state: {
    test: 123
  },
  mutations: {
    testMutations(state) {
      state.test = 456
    }
  },
  actions: {

  },
  modules: {
    color
  }
})