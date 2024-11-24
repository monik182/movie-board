import React from 'react'
import { ErrorMessage } from '../App.styles'
import { EnhancedMovie } from '../types'
import { Input } from 'antd'
import { MovieList } from '../components'
import { useMovieService, useMovieStorage } from '../hooks'

export const SearchMovies: React.FC = () => {
  const { saveMovie } = useMovieStorage()
  const { page, query, movies, metadata, loading, error, fetchMovies, setMovies, handleOnChange, handlePageChange } = useMovieService()

  const handleSaveMovie = async (movie: EnhancedMovie) => {
    await saveMovie(movie)
    const updatedMovie = { ...movie, saved: true }
    setMovies(movies.map((m) => m.id === movie.id ? updatedMovie : m))
  }

  return (
    <div>
      <h1>Find movies</h1>
      <Input.Search
        allowClear
        type="text"
        value={query}
        onChange={handleOnChange}
        placeholder="Search movie"
        onPressEnter={fetchMovies}
        loading={loading}
        maxLength={100}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <MovieList movies={movies} onAdd={handleSaveMovie} pagination={{ total: metadata?.total_pages, current: page, onChange: handlePageChange }} />
    </div>
  )
}
