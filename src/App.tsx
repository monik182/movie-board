import React from 'react'
import { AppContainer } from './App.styles'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import { MovieBoard } from './MovieBoard'
import { SearchMovies } from './SearchMovies'

const App: React.FC = () => {
  return (
    <Router>
      <AppContainer>
        <nav>
          <Link to="/">Movie Board</Link> | <Link to="/search">Search Movies</Link>
        </nav>
        <Routes>
          <Route path="/" element={<MovieBoard />} />
          <Route path="/search" element={<SearchMovies />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App
