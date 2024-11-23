import React, { useEffect } from 'react'
import { AppContainer } from './App.styles'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import { MoviesWatchList } from './MoviesWatchList'
import { SearchMovies } from './SearchMovies'
import { v4 as uuidv4 } from 'uuid'

const App: React.FC = () => {
  useEffect(() => {
    // Create a new session if it doesn't exist
    if (!localStorage.getItem('sessionId')) {
      const sessionId = uuidv4()
      localStorage.setItem('sessionId', sessionId)
    }
  }, [])

  return (
    <Router>
      <AppContainer>
        <nav>
          <Link to="/">Movie Board</Link> | <Link to="/search">Search Movies</Link>
        </nav>
        <Routes>
          <Route path="/" element={<MoviesWatchList />} />
          <Route path="/search" element={<SearchMovies />} />
        </Routes>
      </AppContainer>
    </Router>
  )
}

export default App
