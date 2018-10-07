
import firebase from 'firebase'
import 'firebase/firestore'
import cache from 'src/cache'
import Database from './DatabaseClass'

export default new Database(firebase).init().collection('users').doc(cache.get('user'))
