import React, { useState } from 'react'
import { ErrorMessage } from '../App.styles'
import { EnhancedMovie } from '../types'
import { Input } from 'antd'
import { MovieList } from '../components'
import { useMovieService, useMovieStorage } from '../hooks'

export const SearchMovies: React.FC = () => {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const { saveMovie } = useMovieStorage()
  const { movies, metadata, loading, error, fetchMovies, setMovies } = useMovieService()

  const handleSaveMovie = async (movie: EnhancedMovie) => {
    await saveMovie(movie)
    const updatedMovie = { ...movie, saved: true }
    setMovies(movies.map((m) => m.id === movie.id ? updatedMovie : m))
  }

  const getMovies = () => {
    fetchMovies(query, page)
  }

  const pageChange = (page: number) => {
    setPage(page)
    fetchMovies(query, page)
  }

  const onChange = (e: any) => {
    const query = e.target.value
    setQuery(query)
    setPage(1)
  }

  return (
    <div>
      <h1>Find movies</h1>
      <Input.Search
        allowClear
        type="text"
        value={query}
        onChange={onChange}
        placeholder="Search movie"
        onPressEnter={getMovies}
        loading={loading}
        maxLength={100}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <MovieList movies={movies} onAdd={handleSaveMovie} pagination={{ total: metadata?.total_pages, current: page, onChange: pageChange }} />
    </div>
  )
}
