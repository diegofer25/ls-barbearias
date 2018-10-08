import cache from 'src/cache'

export default {
  setUser: (state, user) => {
    state.user = user
  },

  setForm: (state, newForm) => {
    state.form = newForm
  },

  toggleDialog: (state, toggle) => {
    state.dialog = toggle
  },

  setClients: (state, clients) => {
    cache.set('clients', clients)
    state.clients = clients
  },

  setBarbers: (state, barbers) => {
    cache.set('barbers', barbers)
    state.barbers = barbers
  },

  setServices: (state, services) => {
    cache.set('services', services)
    state.services = services
  },

  setPayments: (state, payments) => {
    cache.set('payments', payments)
    state.payments = payments
  },

  setSchedules: (state, schedules) => {
    cache.set('schedules', schedules)
    state.schedules = schedules
  },

  setExpenses: (state, expenses) => {
    cache.set('expenses', expenses)
    state.expenses = expenses
  }
}
