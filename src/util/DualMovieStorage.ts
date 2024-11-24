import { FirestoreMovieStorage } from './FirestoreMovieStorage'
import { IndexedDbMovieStorage } from './IndexedDbMovieStorage'
import { EnhancedMovie } from '../types'

export class DualMovieStorage {
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
}
