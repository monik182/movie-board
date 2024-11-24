import { useState } from 'react'
import { MovieService } from '../util'
import { EnhancedMovie, MovieApiResponse } from '../types'
import { notification } from 'antd'
import { useMovieStorage } from './useMovieStorage'

export function useMovieService() {
  const movieService = new MovieService(process.env.REACT_APP_API_URL as string, process.env.REACT_APP_BEARER_TOKEN as string)
  const { movieExists } = useMovieStorage()

  const [metadata, setMetadata] = useState<Omit<MovieApiResponse, 'results'>>()
  const [movies, setMovies] = useState<EnhancedMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')

  const fetchMovies = async () => {
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

  const handlePageChange = (page: number) => {
    setPage(page)
    fetchMovies()
  }

  const handleOnChange = (e: any) => {
    setPage(e.target.value)
    setPage(1)
  }

  return {
    page,
    query,
    movies,
    metadata,
    loading,
    error,
    setQuery,
    setMovies,
    fetchMovies,
    handleOnChange,
    handlePageChange,
  }
}
