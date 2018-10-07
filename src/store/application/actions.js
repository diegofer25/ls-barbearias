export default {
  setForm: ({ commit }, payload) => {
    commit('setForm', payload)
  },

  toggleDialog: ({ commit }, payload) => {
    commit('toggleDialog', payload)
  },

  setClients: ({ commit }, payload) => {
    commit('setClients', payload)
  },

  setServices: ({ commit }, payload) => {
    commit('setServices', payload)
  },

  setPayments: ({ commit }, payload) => {
    commit('setPayments', payload)
  },

  setBarbers: ({ commit }, payload) => {
    commit('setBarbers', payload)
  },

  setSchedules: ({ commit }, payload) => {
    commit('setSchedules', payload)
  }
}
