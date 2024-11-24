import { Button, Input } from 'antd'
import { MovieList } from '../components'
import { useMovieStorage } from '../hooks'
import { useEffect, useState } from 'react'
import { EnhancedMovie } from '../types'
import { SyncOutlined } from '@ant-design/icons'
import styled from 'styled-components'

export function MoviesWatchList() {
  const { movies, updateMovie, deleteMovie, forceMovieSync } = useMovieStorage()
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
      <Header>
        <h1>Movies Watch List</h1>
        {movies.length && <Button type="link" onClick={forceMovieSync}>Sync <SyncOutlined /></Button>}
      </Header>


      <Input.Search
        allowClear
        type="text"
        onChange={(e) => handleOnChange(e.target.value)}
        placeholder="Search movie"
        maxLength={100}
      />
      <MovieList movies={filteredMovies} onDelete={deleteMovie} onChange={updateMovie} pagination={{ pageSize: 100 }} />
    </div>

  )
}

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
`
