import { useEffect, useState } from 'react';
import { MovieList } from './components';
import { IndexedDbMovieStorage } from './util';
import { EnhancedMovie } from './types';

export function MoviesWatchList() {
  const [movies, setMovies] = useState<EnhancedMovie[]>([])
  const movieStorage = new IndexedDbMovieStorage()
  async function getMovies() {
    try {
      const movies = await movieStorage.getMovies()
      // Move watched movies to the bottom of the list and also order alphabetically
      const orderedMovies = movies.sort((a, b) => {
        if (a.watched === b.watched) {
          return a.title.localeCompare(b.title)
        }
        return a.watched ? 1 : -1
      })
      // console.log(movies)
      setMovies(orderedMovies)
    } catch (err) {
      console.error('Failed to fetch movies', err)
    }
  }

  const handleUpdateMovie = async (movie: EnhancedMovie) => {
    const updatedMovie = { ...movie, watched: !movie.watched }
    console.log('movie to update', updatedMovie)
    try {
      await movieStorage.updateMovie(updatedMovie)
      getMovies()
      // console.log('Movie saved successfully!')
      // openNotification('success', 'Movie updated successfully!')
    } catch (err) {
      console.error('Failed to save movie', err)
      // openNotification('error', 'Failed to update movie. Please try again.')
      // console.log('Failed to save movie. Please try again.')
    }
  }

  const handleDeleteMovie = async (id: EnhancedMovie['id']) => {
    try {
      await movieStorage.deleteMovie(id)
      getMovies()
      // console.log('Movie deleted successfully!')
      // openNotification('success', 'Movie deleted successfully!')
    } catch (err) {
      console.error('Failed to delete movie', err)
      // openNotification('error', 'Failed to delete movie. Please try again.')
      // console.log('Failed to delete movie. Please try again')
    }
  }

  useEffect(() => {
    // fetchLanguages()
    getMovies()
  }, [])

  return (
    <div>
      <h1>Movies Watch List</h1>
      <MovieList movies={movies} onDelete={handleDeleteMovie} onChange={handleUpdateMovie} pagination={{ pageSize: 100 }} />
    </div>

  )
}
