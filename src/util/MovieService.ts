import { Genre, Movie } from '../types'

export class MovieService {
  private API_URL: string
  private BEARER_TOKEN: string

  language: string = 'en-US'

  constructor(apiUrl: string, bearerToken: string) {
    this.API_URL = apiUrl
    this.BEARER_TOKEN = bearerToken
  }

  private async fetchApi(endpoint: string): Promise<any> {
    const response = await fetch(`${this.API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.BEARER_TOKEN}`,
        'accept': 'application/json',
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch data from API')
    }
    return response.json()
  }

  async fetchMovies(query: string, page: number = 1) {
    try {
      const data = await this.fetchApi(`/3/search/movie?query=${query}&include_adult=false&language=${this.language}&page=${page}`)
      return data
    } catch (err) {
      throw new Error('Failed to fetch movies. Please try again.')
    }
  }

  async fetchLanguages() {
    try {
      const data = await this.fetchApi(`/3/configuration/languages`)
      return data
    } catch (err) {
      throw new Error('Failed to fetch languages. Please try again.')
    }
  }

  async fetchMovieDetail(id: Movie['id']) {
    try {
      const data = await this.fetchApi(`/3/movie/${id}?language=${this.language}`)
      return data
    } catch (err) {
      throw new Error('Failed to fetch movie details. Please try again.')
    }
  }

  async fetchGenres(): Promise<Genre[]> {
    try {
      const data = await this.fetchApi(`/3/genre/movie/list`)
      return data.genres
    } catch (err) {
      throw new Error('Failed to fetch genres. Please try again.')
    }
  }
}
