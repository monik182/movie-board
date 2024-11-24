import { MovieList } from '../components'
import { useMovieStorage } from '../hooks'

export function MoviesWatchList() {
  const { movies, updateMovie, deleteMovie } = useMovieStorage()

  return (
    <div>
      <h1>Movies Watch List</h1>
      <MovieList movies={movies} onDelete={deleteMovie} onChange={updateMovie} pagination={{ pageSize: 100 }} />
    </div>

  )
}
