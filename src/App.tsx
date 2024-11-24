import React from 'react'
import { AppContainer } from './App.styles'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import { MoviesWatchList } from './MoviesWatchList'
import { SearchMovies } from './SearchMovies'
import { SessionIdProvider } from './hooks'
import { Admin } from './Admin'

const App: React.FC = () => {

  return (
    <Router>
      <SessionIdProvider>
        <AppContainer>
          <nav>
            <Link to="/">Movie Board</Link> | <Link to="/search">Search Movies</Link>
          </nav>
          <Routes>
            <Route path="/" element={<MoviesWatchList />} />
            <Route path="/search" element={<SearchMovies />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AppContainer>
      </SessionIdProvider>
    </Router>
  )
}

export default App
