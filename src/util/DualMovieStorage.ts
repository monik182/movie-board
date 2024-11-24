import { FirestoreMovieStorage } from './FirestoreMovieStorage'
import { IndexedDbMovieStorage } from './IndexedDbMovieStorage'
import { EnhancedMovie, MovieStorage } from '../types'

export class DualMovieStorage implements MovieStorage {
  private indexedDbStorage = new IndexedDbMovieStorage()
  private firestoreStorage: FirestoreMovieStorage

  constructor(sessionId: string) {
    this.firestoreStorage = new FirestoreMovieStorage(sessionId)
  }

  async saveMovie(movie: EnhancedMovie): Promise<void> {
    await this.indexedDbStorage.saveMovie(movie)
    await this.firestoreStorage.saveMovie(movie)
  }

  async getMovies(): Promise<EnhancedMovie[]> {
    const movies = await this.indexedDbStorage.getMovies()
    if (!movies.length) {
      const firestoreMovies = await this.firestoreStorage.getMovies()
      for (const movie of firestoreMovies) {
        await this.indexedDbStorage.saveMovie(movie)
      }
      return firestoreMovies
    }
    return movies
  }

  async updateMovie(movie: EnhancedMovie): Promise<void> {
    await this.indexedDbStorage.updateMovie(movie)
    await this.firestoreStorage.updateMovie(movie)
  }

  async deleteMovie(movieId: EnhancedMovie['id']): Promise<void> {
    await this.indexedDbStorage.deleteMovie(movieId)
    await this.firestoreStorage.deleteMovie(movieId)
  }

  async movieExists(movieId: EnhancedMovie['id']): Promise<boolean> {
    return this.indexedDbStorage.movieExists(movieId)
  }

  async forceMovieSync(): Promise<void> {
    const movies = await this.indexedDbStorage.getMovies()
    for (const movie of movies) {
      await this.firestoreStorage.saveMovie(movie)
    }
  }

  async forceMovieSyncFromFirestore(): Promise<void> {
    const movies = await this.firestoreStorage.getMovies()
    console.log('Forcing movie sync from Firestore...', movies)
    for (const movie of movies) {
      await this.indexedDbStorage.saveMovie(movie)
    }
  }
}
