export default {
  namespaced: true,
  state: {
    color_test: 'red'
  },
  mutations: {
    colorChange(state) {
      state.color_test = 'blue'
    }
  },
  getters: {

  }
}