import barberModule from './modules/barber'
const { pushBarber, getBarbers, deleteBarber, editBarber } = barberModule

import serviceModule from './modules/service'
const { getServiceById, pushService, editService, getServices, deleteService } = serviceModule

import clientModule from './modules/client'
const { getClients, pushClient, editClient, deleteClient } = clientModule

import expenseModule from './modules/expense'
const { getExpenses, pushExpense, editExpense, deleteExpense } = expenseModule

import paymentModule from './modules/payment'
const { pushPayment, getPayments } = paymentModule

import scheduleModule from './modules/schedulings'
const { pushSchedule, getSchedules, editSchedule, deleteSchedule } = scheduleModule

import userModule from './modules/user'
const { getUser, setUset } = userModule

export default {
  getUser,
  setUset,
  pushBarber,
  getBarbers,
  getServiceById,
  deleteBarber,
  getClients,
  pushClient,
  editClient,
  deleteClient,
  getExpenses,
  pushExpense,
  editExpense,
  deleteExpense,
  pushService,
  editService,
  getServices,
  deleteService,
  pushPayment,
  getPayments,
  pushSchedule,
  getSchedules,
  editBarber,
  editSchedule,
  deleteSchedule
}
