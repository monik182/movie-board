import { useSessionIdContext } from './hooks'
import { FirestoreMovieStorage, IndexedDbMovieStorage } from './util'
import { Button } from 'antd'

export function Admin() {
  const { sessionId } = useSessionIdContext()

  if (!sessionId) {
    return <div>Session ID not available</div>
  }

  const indexedDbStorage = new IndexedDbMovieStorage()
  const firestoreStorage = new FirestoreMovieStorage(sessionId)
  
  const uploadDataToFirebase = async () => {
    try {
      const movies = await indexedDbStorage.getMovies()
      console.log('movies', movies)
      for (const movie of movies) {
        await firestoreStorage.saveMovie(movie)
        console.log('Movie uploaded to Firebase:', movie)
      }
      console.log('Data uploaded to Firebase successfully!')
    } catch (err) {
      console.error('Failed to upload data to Firebase', err)
      console.log('Failed to upload data to Firebase. Please try again.')
    }
  }

  return (
    <div>
      <h1>Admin</h1>
      <Button type="primary" onClick={uploadDataToFirebase}>Upload Data to Firebase</Button>
    </div>
  )
}
