import { IDBPDatabase, openDB } from 'idb'
import { EnhancedMovie, MovieStorage } from './types'

export class IndexedDbMovieStorage implements MovieStorage {
  private dbPromise: Promise<IDBPDatabase>

  constructor() {
    this.dbPromise = openDB('movies-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('movies')) {
          db.createObjectStore('movies', { keyPath: 'id' })
        }
      },
    })
  }

  async saveMovie(movie: EnhancedMovie): Promise<void> {
    const db = await this.dbPromise
    await db.put('movies', movie)
  }

  async getMovies(): Promise<EnhancedMovie[]> {
    const db = await this.dbPromise
    return await db.getAll('movies')
  }

  async updateMovie(movie: EnhancedMovie): Promise<void> {
    const db = await this.dbPromise
    const existingMovie = await db.get('movies', movie.id)
    if (existingMovie) {
      await db.put('movies', movie)
    } else {
      throw new Error('Movie not found')
    }
  }

  async deleteMovie(movieId: EnhancedMovie['id']): Promise<void> {
    const db = await this.dbPromise
    await db.delete('movies', movieId)
  }

  async movieExists(movieId: EnhancedMovie['id']): Promise<boolean> {
    const db = await this.dbPromise;
    const movie = await db.get('movies', movieId);
    return !!movie;
  }
}
