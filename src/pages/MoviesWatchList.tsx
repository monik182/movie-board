import { Button, Input, Select } from 'antd'
import { MovieList } from '../components'
import { useMovieStorage } from '../hooks'
import { useEffect, useState } from 'react'
import { EnhancedMovie, Genre, Option } from '../types'
import { SyncOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { MovieService } from '../util'

export function MoviesWatchList() {
  const { movies, loading, updateMovie, deleteMovie, forceMovieSync } = useMovieStorage()
  const [searchText, setSearchText] = useState('')
  const [genres, setGenres] = useState<Option[]>([])
  const [selectedGenre, setSelectedGenre] = useState<Genre['id']>()
  const [filteredMovies, setFilteredMovies] = useState<EnhancedMovie[]>(movies)
  const movieService = new MovieService(process.env.REACT_APP_API_URL as string, process.env.REACT_APP_BEARER_TOKEN as string)
  const getGenresOptions = async () => {
    const genres = await movieService.fetchGenres()
    setGenres(genres.map((genre) => ({ value: genre.id, label: genre.name })))
  }

  const filterMoviesByName = (text: string) => movies.filter((movie) => movie.title.toLowerCase().includes(text.toLowerCase()))
  const filterMoviesByGenre = (genreId: Genre['id']) => movies.filter((movie) => movie.genre_ids.includes(genreId))

  const handleOnChange = (text: string) => {
    setSearchText(text)
    if (!text) {
      setFilteredMovies(movies)
      return
    }
    setFilteredMovies(filterMoviesByName(text))
  }

  useEffect(() => {
    if (!searchText) {
      setFilteredMovies(movies)
    } else {
      setFilteredMovies(filterMoviesByName(searchText))
    }
  }, [movies, searchText])

  useEffect(() => {
    if (selectedGenre) {
      setFilteredMovies(filterMoviesByGenre(selectedGenre))
    } else {
      setFilteredMovies(movies)
    }
  }, [movies, selectedGenre])

  useEffect(() => {
    getGenresOptions()
  }, [])

  return (
    <div>
      <Header>
        <h1>Movies Watch List</h1>
        {movies.length && <Button type="link" onClick={forceMovieSync} loading={loading}>Sync <SyncOutlined /></Button>}
      </Header>

      <SearchBar>
        <Input.Search
          allowClear
          type="text"
          onChange={(e) => handleOnChange(e.target.value)}
          placeholder="Search movie"
          maxLength={100}
          loading={loading}
        />
        <Select
          allowClear
          placeholder="Genre"
          style={{ width: 250 }}
          options={genres}
          onChange={setSelectedGenre}
        />
      </SearchBar>
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

const SearchBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  gap: 16px;
  width: 100%;
  margin: 0 auto;
`
