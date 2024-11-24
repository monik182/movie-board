import { useEffect, useState } from 'react'
import { EnhancedMovie } from '../types'
import { IndexedDbMovieStorage } from '../util'

export function useMovieStorage() {
  const [movies, setMovies] = useState<EnhancedMovie[]>([])
  const movieStorage = new IndexedDbMovieStorage()

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

  const updateMovie = async (movie: EnhancedMovie) => {
    try {
      const updatedMovie = { ...movie, watched: !movie.watched }
      await movieStorage.updateMovie(updatedMovie)
      getMovies()
    } catch (err) {
      console.error('Failed to update movie', err)
    }
  }

  const deleteMovie = async (id: EnhancedMovie['id']) => {
    try {
      await movieStorage.deleteMovie(id)
      getMovies()
    } catch (err) {
      console.error('Failed to delete movie', err)
    }
  }

  useEffect(() => {
    getMovies()
  }, [])

  return {
    movies,
    getMovies,
    updateMovie,
    deleteMovie,
  }
}
