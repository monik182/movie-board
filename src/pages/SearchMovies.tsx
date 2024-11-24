import React, { useState } from 'react'
import { ErrorMessage, SearchBar } from '../App.styles'
import { EnhancedMovie, MovieApiResponse } from '../types'
import { notification, Button, Input } from 'antd'
import { MovieList } from '../components'
import { useMovieStorage } from '../hooks'
// import { MovieService } from '../util'

const API_URL = 'https://api.themoviedb.org'

type NotificationType = 'success' | 'info' | 'warning' | 'error'

export const SearchMovies: React.FC = () => {
  const { saveMovie, movieExists } = useMovieStorage()
  const [searchTerm, setSearchTerm] = useState('')
  const [moviesMetadata, setMoviesMetadata] = useState<Omit<MovieApiResponse, 'results'>>()
  const [fetchedMovies, setFetchedMovies] = useState<EnhancedMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('en-US')
  const [page, setPage] = useState(1)
  // const movieService = new MovieService(process.env.REACT_APP_API_URL as string, process.env.REACT_APP_BEARER_TOKEN as string);

  async function fetchMovies() {
    setLoading(true)
    setError('')
    setFetchedMovies([])
    try {
      const response = await fetch(`${API_URL}/3/search/movie?query=${searchTerm}&include_adult=false&language=${language}&page=${page}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
          'accept': 'application/json'
        }
      })
      const data = await response.json()
      // console.log(data)
      const movieData = await Promise.all(
        data.results.map(async (movie: any) => ({
          ...movie,
          watched: false,
          saved: await movieExists(movie.id),
        }))
      );
      const sortedMovies = movieData.sort((a, b) => parseInt(a.year) - parseInt(b.year))

      console.log(sortedMovies)
      setFetchedMovies(sortedMovies)
      setMoviesMetadata({
        page: data.page,
        total_pages: data.total_pages,
        total_results: data.total_results
      })
    } catch (err) {
      setError('Failed to fetch movies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setPage(page)
    fetchMovies()
  }

  const handleSaveMovie = async (movie: EnhancedMovie) => {
    try {
      await saveMovie(movie)
      const updatedMovie = { ...movie, saved: true }
      setFetchedMovies(fetchedMovies.map((m) => m.id === movie.id ? updatedMovie : m))
      console.log('Movie saved successfully!')
      // openNotification('success', 'Movie saved successfully!')
    } catch (err) {
      console.error('Failed to save movie', err)
      // openNotification('error', 'Failed to save movie. Please try again.')
      // console.log('Failed to save movie. Please try again.')
    }
  }

  const handleOnChange = (e: any) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }


  return (
    <div>
      <h1>Find movies</h1>
      <Input.Search
        allowClear
        type="text"
        value={searchTerm}
        onChange={handleOnChange}
        placeholder="Search movie"
        onPressEnter={fetchMovies}
        loading={loading}
        maxLength={100}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <MovieList movies={fetchedMovies} onAdd={handleSaveMovie} pagination={{ total: moviesMetadata?.total_pages, current: page, onChange: handlePageChange }} />
    </div>
  )
}
