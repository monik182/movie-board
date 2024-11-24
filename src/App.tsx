import React from 'react'
import { AppContainer } from './App.styles'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import { MoviesWatchList, SearchMovies } from './pages'
import { SessionIdProvider, useSessionIdContext } from './hooks'
import { Admin } from './Admin'
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';
import { Navbar } from './components'

const AppContent: React.FC = () => {

  const { sessionId } = useSessionIdContext()

  if (!sessionId) {
    return (
      <Flex align="center" gap="middle">
        <Spin indicator={<LoadingOutlined spin />} size="large" fullscreen tip="Loading..." />
      </Flex>
    )
  }

  return (
    <div>
      <AppContainer>
        <Navbar />
        <Routes>
          <Route path="/" element={<MoviesWatchList />} />
          <Route path="/:id" element={<MoviesWatchList />} />
          <Route path="/search" element={<SearchMovies />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AppContainer>
      <footer>
        <p>Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB</a></p>
      </footer>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <SessionIdProvider>
        <AppContent />
      </SessionIdProvider>
    </Router>
  )
}

export default App
