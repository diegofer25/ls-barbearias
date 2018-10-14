import db from 'src/firestore/init'

export default {
  pushSchedule: (schedule) => {
    return db.collection('schedules').add(schedule)
      .then((docRef) => {
        return {
          message: 'Cliente agendado',
          id: docRef.id
        }
      })
      .catch(processError)
  },

  getSchedules: () => {
    return db.collection('schedules').get()
      .then((querySnapshot) => {
        let schedules = []
        querySnapshot.forEach((doc) => {
          let schedule = doc.data()
          schedule.id = doc.id
          schedules.push(schedule)
        })
        return {
          data: schedules
        }
      })
      .catch(processError)
  },

  editSchedule: (schedule) => {
    return db.collection('schedules').doc(schedule.id).set(schedule)
      .then(() => {
        return {
          message: 'Agendamento adiado'
        }
      })
      .catch(processError)
  },

  deleteSchedule: (id) => {
    return db.collection('schedules').doc(id).delete()
      .then(() => {
        return {
          message: 'Agendamento desmarcado'
        }
      })
      .catch(processError)
  }
}

function processError (error) {
  console.error(error)
  return {
    message: 'Falha na comunicação com o servidor'
  }
}
