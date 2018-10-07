import barberModule from './modules/barber'
const { pushBarber, getBarbers, deleteBarber, editBarber } = barberModule

import serviceModule from './modules/service'
const { getServiceById, pushService, editService, getServices, deleteService } = serviceModule

import clientModule from './modules/client'
const { getClients, pushClient, editClient, deleteClient } = clientModule

import paymentModule from './modules/payment'
const { pushPayment, getPayments } = paymentModule

import scheduleModule from './modules/schedulings'
const { pushSchedule, getSchedules, editSchedule, deleteSchedule } = scheduleModule

export default {
  pushBarber,
  getBarbers,
  getServiceById,
  deleteBarber,
  getClients,
  pushClient,
  editClient,
  deleteClient,
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
