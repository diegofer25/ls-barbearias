import db from 'src/firestore/init'

export default {
  pushBarber: (barber) => {
    return db.collection('barbers').add(barber)
      .then((docRef) => {
        return {
          message: barber.name + ' cadastrado com sucesso',
          id: docRef.id
        }
      })
      .catch(processError)
  },

  getBarbers: () => {
    return db.collection('barbers').get()
      .then((querySnapshot) => {
        let barbers = []
        querySnapshot.forEach((doc) => {
          let barber = doc.data()
          barber.id = doc.id
          barbers.push(barber)
        })
        return {
          data: barbers
        }
      })
      .catch(processError)
  },

  editBarber: (barber) => {
    return db.collection('barbers').doc(barber.id).set(barber)
      .then(() => {
        return {
          message: 'Barbeiro atualizado com sucesso'
        }
      })
      .catch(processError)
  },

  deleteBarber: (id) => {
    return db.collection('barbers').doc(id).delete()
      .then(function () {
        return {
          message: 'Barbeiro exluído com sucesso'
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
