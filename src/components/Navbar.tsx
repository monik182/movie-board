import { Link } from 'react-router-dom';
import { useSessionIdContext } from '../hooks';
import { SharePage } from './Share';
import styled from 'styled-components';

export function Navbar() {
  const { sessionId } = useSessionIdContext()
  return (
    <Container>
      <nav>
        <Link to="/">Movie Watch List</Link> | <Link to="/search">Find Movies</Link>
      </nav>
      <SharePage sessionId={sessionId} />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // padding: 10px;
  // background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;

  nav {
    a {
      color: #000;
      text-decoration: none;
      padding: 5px;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`