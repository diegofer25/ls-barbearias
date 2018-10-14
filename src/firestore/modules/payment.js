import db from 'src/firestore/init'

export default {
  pushPayment: (payment) => {
    return db.collection('payments').add(payment)
      .then((docRef) => {
        return {
          message: 'Pagamento realizado',
          id: docRef.id
        }
      })
      .catch(processError)
  },

  getPayments: () => {
    return db.collection('payments').get()
      .then((querySnapshot) => {
        let payments = []
        querySnapshot.forEach((doc) => {
          let payment = doc.data()
          payment.id = doc.id
          payments.push(payment)
        })
        return {
          data: payments
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
