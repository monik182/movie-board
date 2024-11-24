import React from 'react'
import { AppContainer } from './App.styles'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import { MoviesWatchList, SearchMovies } from './pages'
import { SessionIdProvider, useSessionIdContext } from './hooks'
import { Admin } from './Admin'
import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

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
    <Router>
      <AppContainer>
        <nav>
          <Link to="/">Movie Watch List</Link> | <Link to="/search">Find Movies</Link>
        </nav>
        <Routes>
          <Route path="/" element={<MoviesWatchList />} />
          <Route path="/search" element={<SearchMovies />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AppContainer>
    </Router>
  )
}

const App: React.FC = () => {
  return (
    <SessionIdProvider>
      <AppContent />
    </SessionIdProvider>
  )
}

export default App
