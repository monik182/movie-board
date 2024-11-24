import { Input } from 'antd'
import { MovieList } from '../components'
import { useMovieStorage } from '../hooks'
import { useState } from 'react'
import { EnhancedMovie } from '../types'

export function MoviesWatchList() {
  const { movies, updateMovie, deleteMovie } = useMovieStorage()
  const [filteredMovies, setFilteredMovies] = useState<EnhancedMovie[]>(movies)
  const handleOnChange = (text: string) => {
    if (!text) {
      setFilteredMovies(movies)
      return
    }
    const filterMovies = (text: string) => movies.filter((movie) => movie.title.toLowerCase().includes(text.toLowerCase()))
    setFilteredMovies(filterMovies(text))
  }

  return (
    <div>
      <h1>Movies Watch List</h1>
      <Input.Search
        onChange={(e) => handleOnChange(e.target.value)}
        style={{ width: 500 }}
        placeholder="Search movie"
      />
      <MovieList movies={filteredMovies} onDelete={deleteMovie} onChange={updateMovie} pagination={{ pageSize: 100 }} />
    </div>

  )
}
