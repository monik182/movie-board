import { useEffect, useState } from 'react'
import { EnhancedMovie } from '../types'
import { DualMovieStorage } from '../util'
import { useSessionIdContext } from './SessionIdContext'
import { notification } from 'antd'

export function useMovieStorage() {
  const { sessionId } = useSessionIdContext()
  const [movies, setMovies] = useState<EnhancedMovie[]>([])
  const [loading, setLoading] = useState(false)

  if (!sessionId) {
    throw new Error('Session ID is required')
  }

  const movieStorage = new DualMovieStorage(sessionId)

  const getMovies = async () => {
    setLoading(true)
    try {
      const movies = await movieStorage.getMovies()
      const orderedMovies = movies.sort((a, b) => {
        if (a.release_date === b.release_date) {
          return a.title.localeCompare(b.title)
        }
        if (a.watched === b.watched) {
          return b.release_date.localeCompare(a.release_date)
        }
        return a.watched ? 1 : -1
      })
      setMovies(orderedMovies)
    } catch (err) {
      console.error('Failed to fetch movies', err)
      notification.error({ message: 'Failed to fetch movies. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const saveMovie = async (movie: EnhancedMovie) => {
    try {
      await movieStorage.saveMovie(movie)
      notification.success({ message: 'Movie saved successfully!' })
    } catch (err) {
      console.error('Failed to save movie', err)
      notification.error({ message: 'Failed to save movie. Please try again.' })
    }
  }

  const updateMovie = async (movie: EnhancedMovie) => {
    try {
      const updatedMovie = { ...movie, watched: !movie.watched }
      await movieStorage.updateMovie(updatedMovie)
      setMovies(movies.map((m) => m.id === movie.id ? updatedMovie : m))
      notification.success({ message: 'Movie updated successfully!' })
    } catch (err) {
      console.error('Failed to update movie', err)
      notification.error({ message: 'Failed to update movie. Please try again.' })
    }
  }

  const deleteMovie = async (id: EnhancedMovie['id']) => {
    try {
      await movieStorage.deleteMovie(id)
      setMovies(movies.filter((movie) => movie.id !== id))
      notification.success({ message: 'Movie deleted successfully!' })
    } catch (err) {
      console.error('Failed to delete movie', err)
      notification.error({ message: 'Failed to delete movie. Please try again.' })
    }
  }

  const movieExists = async (id: EnhancedMovie['id']) => {
    return movieStorage.movieExists(id)
  }

  const forceMovieSync = async () => {
    try {
      await movieStorage.forceMovieSyncFromFirestore()
      await movieStorage.forceMovieSync()
      getMovies()
      notification.success({ message: 'Movies synced successfully!' })
    } catch (err) {
      console.error('Failed to sync movies', err)
      notification.error({ message: 'Failed to sync movies. Please try again.' })
    }
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
    loading,
    getMovies,
    saveMovie,
    updateMovie,
    deleteMovie,
    movieExists,
    forceMovieSync,
  }
}
