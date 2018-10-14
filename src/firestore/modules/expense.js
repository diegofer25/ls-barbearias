import db from 'src/firestore/init'

export default {
  pushExpense: (expense) => {
    return db.collection('expenses').add(expense)
      .then((docRef) => {
        return {
          message: 'Categoria de despesa cadastrada',
          id: docRef.id
        }
      })
      .catch(processError)
  },

  getExpenses: () => {
    return db.collection('expenses').get()
      .then((querySnapshot) => {
        let expenses = []
        querySnapshot.forEach((doc) => {
          let expense = doc.data()
          expense.id = doc.id
          expenses.push(expense)
        })
        return {
          data: expenses
        }
      })
      .catch(processError)
  },

  editExpense: (expense) => {
    return db.collection('expenses').doc(expense.id).set(expense)
      .then(() => {
        return {
          message: 'Categoria de despesa alterada'
        }
      })
      .catch(processError)
  },

  deleteExpense: (id) => {
    return db.collection('expenses').doc(id).delete()
      .then(() => {
        return {
          message: 'Categoria de despesa Deletada'
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
