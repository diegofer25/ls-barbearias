import db from 'src/firestore/init'

export default {
  getUser: () => {
    return db.get().then(doc => {
      if (doc.exists) {
        return doc.data()
      } else {
        return {}
      }
    }).catch(processError)
  },

  setUset: (user) => {
    return db.set(user).then(() => {
      return {
        message: 'Informações de usuário salvas!'
      }
    })
  }
}

function processError (error) {
  console.error(error)
  return {
    error: error,
    message: 'Falha na comunicação com o servidor'
  }
}
