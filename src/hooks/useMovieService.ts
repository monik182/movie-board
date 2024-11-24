import { useState } from 'react'
import { MovieService } from '../util'
import { EnhancedMovie, Movie, MovieApiResponse } from '../types'
import { notification } from 'antd'
import { useMovieStorage } from './useMovieStorage'

export function useMovieService() {
  const movieService = new MovieService(process.env.REACT_APP_API_URL as string, process.env.REACT_APP_BEARER_TOKEN as string)
  const { movieExists } = useMovieStorage()

  const [metadata, setMetadata] = useState<Omit<MovieApiResponse, 'results'>>()
  const [movies, setMovies] = useState<EnhancedMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchMovies = async (query: string, page = 1) => {
    if (!query) return
    setLoading(true)
    setError('')
    setMovies([])
    try {
      const data = await movieService.fetchMovies(query, page)
      const movieData = await Promise.all(
        data.results.map(async (movie: any) => ({
          ...movie,
          watched: false,
          saved: await movieExists(movie.id),
        }))
      )
      const sortedMovies = movieData.sort((a, b) => parseInt(b.release_date) - parseInt(a.release_date))

      setMovies(sortedMovies)
      setMetadata({
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results,
      })
    } catch (err) {
      setError('Failed to fetch movies. Please try again.')
      notification.error({ message: 'Failed to fetch movies. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const getGenres = async () => {
    try {
      const genres = await movieService.fetchGenres()
      return genres
    } catch (err) {
      setError('Failed to fetch genres. Please try again.')
    }
  }

  const getMovieDetails = async (id: Movie['id']) => {
    try {
      const movie = await movieService.fetchMovieDetail(id)
      return movie
    } catch (err) {
      setError('Failed to fetch movie details. Please try again.')
    }
  }

  return {
    movies,
    metadata,
    loading,
    error,
    setMovies,
    fetchMovies,
    getGenres,
    getMovieDetails,
  }
}
