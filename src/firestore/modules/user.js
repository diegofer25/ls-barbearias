import db from 'src/firestore/init'

export default {
  getUser: () => {
    return db.get().then(doc => {
      if (!doc.empty) {
        const license = doc.data()
        Object.keys(license.users).map(key => {
          delete license.users[key].pass
        })
        return license
      } else {
        return {}
      }
    }).catch(processError)
  },

  setUser: (user) => {
    return db.set(user).then(() => {
      return {
        message: 'Informações de usuário salvas!'
      }
    }).catch(processError)
  }
}

function processError (error) {
  console.error(error)
  return {
    error: error,
    message: 'Falha na comunicação com o servidor'
  }
}
