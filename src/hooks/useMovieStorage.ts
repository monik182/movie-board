import { useEffect, useState } from 'react'
import { EnhancedMovie } from '../types'
import { DualMovieStorage } from '../util'
import { useSessionIdContext } from './SessionIdContext'

export function useMovieStorage() {
  const { sessionId } = useSessionIdContext()
  const [movies, setMovies] = useState<EnhancedMovie[]>([])

  if (!sessionId) {
    throw new Error('Session ID is required')
  }

  const movieStorage = new DualMovieStorage(sessionId)

  const getMovies = async () => {
    try {
      const movies = await movieStorage.getMovies()
      const orderedMovies = movies.sort((a, b) => {
        if (a.watched === b.watched) {
          return a.title.localeCompare(b.title)
        }
        return a.watched ? 1 : -1
      })
      setMovies(orderedMovies)
    } catch (err) {
      console.error('Failed to fetch movies', err)
    }
  }

  const saveMovie = async (movie: EnhancedMovie) => {
    try {
      await movieStorage.saveMovie(movie)
    } catch (err) {
      console.error('Failed to save movie', err)
    }
  }

  const updateMovie = async (movie: EnhancedMovie) => {
    try {
      const updatedMovie = { ...movie, watched: !movie.watched }
      await movieStorage.updateMovie(updatedMovie)
      setMovies(movies.map((m) => m.id === movie.id ? updatedMovie : m))
    } catch (err) {
      console.error('Failed to update movie', err)
    }
  }

  const deleteMovie = async (id: EnhancedMovie['id']) => {
    try {
      await movieStorage.deleteMovie(id)
      setMovies(movies.filter((movie) => movie.id !== id))
    } catch (err) {
      console.error('Failed to delete movie', err)
    }
  }

  const movieExists = async (id: EnhancedMovie['id']) => {
    return movieStorage.movieExists(id)
  }

  const forceMovieSync = async () => {
    await movieStorage.forceMovieSyncFromFirestore()
    await movieStorage.forceMovieSync()
  }

  useEffect(() => {
    getMovies()
  }, [sessionId])

  useEffect(() => {
    const interval = setInterval(() => {
      forceMovieSync()
    }, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return {
    movies,
    getMovies,
    saveMovie,
    updateMovie,
    deleteMovie,
    movieExists,
    forceMovieSync,
  }
}
