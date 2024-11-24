import { Input } from 'antd'
import { MovieList, SharePage } from '../components'
import { useMovieStorage, useSessionIdContext } from '../hooks'
import { useEffect, useState } from 'react'
import { EnhancedMovie } from '../types'

export function MoviesWatchList() {
  const { sessionId } = useSessionIdContext()
  const { movies, updateMovie, deleteMovie } = useMovieStorage()
  const [searchText, setSearchText] = useState('')
  const [filteredMovies, setFilteredMovies] = useState<EnhancedMovie[]>(movies)

  const filterMovies = (text: string) => movies.filter((movie) => movie.title.toLowerCase().includes(text.toLowerCase()))

  const handleOnChange = (text: string) => {
    setSearchText(text)
    if (!text) {
      setFilteredMovies(movies)
      return
    }
    setFilteredMovies(filterMovies(text))
  }

  useEffect(() => {
    if (!searchText) {
      setFilteredMovies(movies)
    } else {
      setFilteredMovies(filterMovies(searchText))
    }
  }, [movies, searchText])

  return (
    <div>
      <h1>Movies Watch List</h1>
      <SharePage sessionId={sessionId} />

      <Input.Search
        allowClear
        type="text"
        style={{ width: 500 }}
        onChange={(e) => handleOnChange(e.target.value)}
        placeholder="Search movie"
        maxLength={100}
      />
      <MovieList movies={filteredMovies} onDelete={deleteMovie} onChange={updateMovie} pagination={{ pageSize: 100 }} />
    </div>

  )
}
