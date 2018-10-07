import firebaseAuth from './firebaseAuth'

export default class Database {
  constructor (firebase) {
    this.firebase = firebase
  }

  init () {
    if (!this.firebase.apps.length) {
      this.firebase.initializeApp(firebaseAuth)
    }
    this.firebase.firestore().settings(({ timestampsInSnapshots: true }))
    return this.firebase.firestore()
  }
}
