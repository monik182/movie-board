import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore';
import { EnhancedMovie, MovieStorage } from '../types';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export class FirestoreMovieStorage implements MovieStorage {
  private moviesCollection;

  constructor(sessionId: string) {
    this.moviesCollection = collection(db, `movies-${sessionId}`);
  }

  async saveMovie(movie: EnhancedMovie): Promise<void> {
    await addDoc(this.moviesCollection, movie);
  }

  async getMovies(): Promise<any[]> {
    const querySnapshot = await getDocs(this.moviesCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))// as EnhancedMovie[];
  }

  async updateMovie(movie: EnhancedMovie): Promise<void> {
    const movieDoc = doc(db, `movies-${movie.id}`, movie.id.toString());
    await setDoc(movieDoc, movie);
  }

  async deleteMovie(movieId: EnhancedMovie['id']): Promise<void> {
    const movieDoc = doc(db, `movies-${movieId}`, movieId.toString());
    await deleteDoc(movieDoc);
  }

  async movieExists(movieId: EnhancedMovie['id']): Promise<boolean> {
    const querySnapshot = await getDocs(this.moviesCollection);
    return querySnapshot.docs.some(doc => doc.id === movieId.toString());
  }
}
