import styled from 'styled-components';

export const AppContainer = styled.div`
  padding: 20px;
  text-align: center;
`;

export const SearchBar = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;

  input {
    padding: 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    margin-left: 10px;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    cursor: pointer;

    &:disabled {
      background-color: #888;
      cursor: not-allowed;
    }
  }
`;

export const MovieList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
`;

export const MovieItem = styled.div`
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 8px;
  width: 200px;
  text-align: left;
  cursor: pointer;

  h2 {
    font-size: 18px;
    margin-bottom: 5px;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
`;
