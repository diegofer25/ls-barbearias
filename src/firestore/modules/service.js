import db from 'src/firestore/init'

export default {
  getServiceById: (barberId) => {
    return db.collection('payments').where('barber', '==', barberId).get()
      .then((querySnapshot) => {
        let services = []
        querySnapshot.forEach((doc) => {
          let service = doc.data()
          service.id = doc.id
          services.push(service)
        })
        return {
          data: services
        }
      })
      .catch(processError)
  },

  getServices: () => {
    return db.collection('services').get()
      .then((querySnapshot) => {
        let services = []
        querySnapshot.forEach((doc) => {
          let service = doc.data()
          service.id = doc.id
          services.push(service)
        })
        return {
          data: services
        }
      })
      .catch(processError)
  },

  pushService: (service) => {
    return db.collection('services').add(service)
      .then((docRef) => {
        return {
          message: 'Serviço Cadastrado com sucesso',
          id: docRef.id
        }
      })
      .catch(processError)
  },

  editService: (service) => {
    return db.collection('services').doc(service.id).set(service)
      .then(() => {
        return {
          message: 'Serviço atualizado com sucesso'
        }
      })
      .catch(processError)
  },

  deleteService: (id) => {
    return db.collection('services').doc(id).delete()
      .then(() => {
        return {
          message: 'service deletado com sucesso'
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
