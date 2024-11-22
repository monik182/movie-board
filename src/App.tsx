import React, { useEffect, useState } from 'react'
import { AppContainer, ErrorMessage, MovieItem, MovieList, SearchBar } from './App.styles'
import { IndexedDbMovieStorage } from './IndexedDbMovieStorageClass'
import { EnhancedMovie } from './types'

const API_URL = 'https://api.themoviedb.org'
const IMG_URL = `https://image.tmdb.org/t/p/w200/`

const App: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [fetchedMovies, setFetchedMovies] = useState<EnhancedMovie[]>([])
  const [movies, setMovies] = useState<EnhancedMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('en-US')
  // const [language, setLanguage] = useState('es-ES')
  const [page, setPage] = useState(1)
  const movieStorage = new IndexedDbMovieStorage()

  async function getMovies() {
    try {
      const movies = await movieStorage.getMovies()
      // console.log(movies)
      setMovies(movies)
    } catch (err) {
      console.error('Failed to fetch movies', err)
    }
  }

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
          saved: await movieStorage.movieExists(movie.id),
        }))
      );
      const sortedMovies = movieData.sort((a, b) => parseInt(a.year) - parseInt(b.year))

      console.log(sortedMovies)
      setFetchedMovies(sortedMovies)
    } catch (err) {
      setError('Failed to fetch movies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function fetchLanguages() {
    const response = await fetch(`${API_URL}/3/configuration/languages`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
        'accept': 'application/json'
      }
    })
    const data = await response.json()
    console.log(data)
  }

  async function fetchMovie(id: string) {
    const response = await fetch(`${API_URL}/3/movie/${id}?language=${language}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`,
        'accept': 'application/json'
      }
    })
    const data = await response.json()
    console.log(data)
  }

  const handleSaveMovie = async (movie: EnhancedMovie) => {
    try {
      await movieStorage.saveMovie(movie)
      getMovies()
      console.log('Movie saved successfully!')
    } catch (err) {
      console.error('Failed to save movie', err)
      console.log('Failed to save movie. Please try again.')
    }
  }

  const handleUpdateMovie = async (movie: EnhancedMovie) => {
    console.log('movie to update', movie)
    try {
      await movieStorage.updateMovie(movie)
      getMovies()
      console.log('Movie saved successfully!')
    } catch (err) {
      console.error('Failed to save movie', err)
      console.log('Failed to save movie. Please try again.')
    }
  }

  const handleDeleteMovie = async (id: EnhancedMovie['id']) => {
    try {
      await movieStorage.deleteMovie(id)
      getMovies()
      console.log('Movie deleted successfully!')
    } catch (err) {
      console.error('Failed to delete movie', err)
      console.log('Failed to delete movie. Please try again')
    }
  }

  useEffect(() => {
    // fetchLanguages()
    getMovies()
  }, [])

  return (
    <AppContainer>
      <h1>Movie Board</h1>
      <SearchBar>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a movie by title..."
        />
        <button onClick={fetchMovies} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </SearchBar>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <h3>Movie Search Results</h3>
      <MovieList>
        {fetchedMovies.map((movie) => (
          <MovieItem key={movie.id}>
            {movie.backdrop_path && (
              <img src={`${IMG_URL}${movie.backdrop_path}`} alt={movie.title} />
            )}
            <h2>{movie.title}</h2>
            <p>Year: {movie.release_date}</p>

            {movie.saved ? (
              <p>Movie already in your watch list {JSON.stringify(movie.saved)}</p>
            ) : (
              <button onClick={() => handleSaveMovie(movie)}>Add Movie to Watch list</button>
            )}
          </MovieItem>
        ))}
      </MovieList>
      <h3>My movies</h3>
      <MovieList>
        {!movies.length && <p>No movies in your watch list</p>}
        {movies.map((movie) => (
          <MovieItem key={movie.id}>
            {movie.backdrop_path && (
              <img src={`${IMG_URL}${movie.backdrop_path}`} alt={movie.title} />
            )}
            <h2>{movie.title}</h2>
            <p>Year: {movie.release_date}</p>

            <button onClick={() => handleDeleteMovie(movie.id)}>Remove Movie from Watch list</button>
            <br />
            <input type="checkbox" checked={movie.watched} onChange={() => handleUpdateMovie({ ...movie, watched: !movie.watched })} /> {movie.watched ? '' : 'Not'} Watched
          </MovieItem>
        ))}
      </MovieList>
    </AppContainer>
  )
}

export default App
