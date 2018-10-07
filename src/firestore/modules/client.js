import db from 'src/firestore/init'

export default {
  getClients: () => {
    return db.collection('clients').get()
      .then((querySnapshot) => {
        let clients = []
        querySnapshot.forEach((doc) => {
          let client = doc.data()
          client.id = doc.id
          clients.push(client)
        })
        return {
          data: clients
        }
      })
      .catch(processError)
  },

  pushClient: (client) => {
    return db.collection('clients').add(client)
      .then((docRef) => {
        return {
          message: 'Cliente Cadastrado com sucesso',
          id: docRef.id
        }
      })
      .catch(processError)
  },

  editClient: (client) => {
    return db.collection('clients').doc(client.id).set(client)
      .then(() => {
        return {
          message: 'Cliente atualizado com sucesso'
        }
      })
      .catch(processError)
  },

  deleteClient: (id) => {
    return db.collection('clients').doc(id).delete()
      .then(() => {
        return {
          message: 'Cliente deletado com sucesso'
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
