export default {
  getUser (state) {
    return state.user
  },

  getClients (state) {
    return state.clients
  },

  getBarbers (state) {
    return state.barbers
  },

  getServices (state) {
    return state.services
  },

  getPayments (state) {
    return state.payments
  },

  getSchedules (state) {
    return state.schedules
  },

  getExpenses (state) {
    return state.expenses
  },

  getForm (state) {
    return state.form
  },

  getDialog (state) {
    return state.dialog
  },

  barberColumns (state) {
    return state.barberColumns
  },

  clientsColumns (state) {
    return state.clientColumns
  },

  servicesColumns (state) {
    return state.servicesColumns
  },

  getIcons (state) {
    return state.icons
  }
}
