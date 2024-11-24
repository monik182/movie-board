import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, setDoc, deleteDoc, doc, getDoc, DocumentSnapshot } from 'firebase/firestore'
import { EnhancedMovie, MovieStorage } from '../types'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export class FirestoreMovieStorage implements MovieStorage {
  private moviesCollection

  constructor(sessionId: string) {
    this.moviesCollection = collection(db, `movies-${sessionId}`)
  }

  async getMovies(): Promise<EnhancedMovie[]> {
    const querySnapshot = await getDocs(this.moviesCollection)
    return querySnapshot.docs.map(this.convertDocToMovie)
  }

  async saveMovie(movie: EnhancedMovie): Promise<void> {
    try {
      const movieDoc = doc(this.moviesCollection, movie.id.toString())
      await setDoc(movieDoc, movie)
    } catch (error) {
      console.error('Error saving movie: ', error)
    }
  }

  async updateMovie(movie: EnhancedMovie): Promise<void> {
    const movieDoc = doc(this.moviesCollection, movie.id.toString())
    await setDoc(movieDoc, movie, { merge: true })
  }

  async deleteMovie(movieId: EnhancedMovie['id']): Promise<void> {
    const movieDoc = doc(this.moviesCollection, movieId.toString())
    await deleteDoc(movieDoc)
  }

  async movieExists(movieId: EnhancedMovie['id']): Promise<boolean> {
    const movieDoc = doc(this.moviesCollection, movieId.toString())
    const docSnapshot = await getDoc(movieDoc)
    return docSnapshot.exists()
  }

  async deleteAll(): Promise<void> {
    try {
      const querySnapshot = await getDocs(this.moviesCollection)
      const batchSize = 500
      let batchCount = 0

      for (const documentSnapshot of querySnapshot.docs) {
        const docRef = doc(this.moviesCollection, documentSnapshot.id)
        await deleteDoc(docRef)
        batchCount++

        if (batchCount >= batchSize) {
          console.log(`Deleted ${batchCount} documents...`)
          batchCount = 0
        }
      }
      console.log('Collection deletion completed successfully.')
    } catch (error) {
      console.error('Error deleting collection: ', error)
    }
  }

  private convertDocToMovie(doc: DocumentSnapshot): EnhancedMovie {
    return { id: parseInt(doc.id), ...doc.data() } as EnhancedMovie
  }
}
