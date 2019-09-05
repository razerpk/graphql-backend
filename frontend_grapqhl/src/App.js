import React, { useState, useEffect } from 'react'
import { useQuery, useMutation, useSubscription , useApolloClient } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import RecommendedBooks from './components/RecommendedBooks'

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    id
    bookCount
  }
}`

const ALL_BOOKS = gql`
{
  allBooks {
    title
    published
    author{name}
    id
    genres
  }
}`

const USER = gql`
{
  me {
    username
    favoriteGenre
  }
}`

const CREATE_BOOK  = gql`
  mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
    addBook(
      title: $title,
      published: $published,
      author: $author,
      genres: $genres
    ) {
      title
      published
      author {name}
      id
      genres
    }
  }
`

const EDIT_AUTHOR  = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      id
      born
      bookCount
    }
  }
`
const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author{name}
      genres
    }
  }
`

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const client = useApolloClient()

  const getUser = async () => {
    const { data } = await client.query({
      query: USER
    })
    setUser(data.me)
  }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('library-user-token')
    if (loggedUserJSON) {
      setUser(getUser())
    }
  }, []) // eslint-disable-line

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const errorNotification = () => errorMessage &&
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>

  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)


  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }]
  })
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })
  const [login] = useMutation(LOGIN, {
    onError: handleError
  })

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(
        `you added 
        title: ${addedBook.title}  
        published: ${addedBook.published} 
        author: ${addedBook.author.name} 
        genres: ${addedBook.genres.map(genre => `${genre} `)}`
        )
    }
  })
  
  const logout = () => {
    setToken(null)
    setUser(null)
    window.localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      {errorNotification()}
      {!token && !window.localStorage.getItem('library-user-token')
        ? 
          <div>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            <button onClick={() => setPage('login')}>login</button>
          </div>
        : 
          <div>
            <button onClick={() => setPage('authors')}>authors</button>
            <button onClick={() => setPage('books')}>books</button>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommendedBooks')}>recommendations</button>
            <button onClick={logout}>logout</button>
          </div>
      }

      <Authors
        show={page === 'authors'}
        result={authors}
        editAuthor={editAuthor}
      />

      <Books
        show={page === 'books'}
        result={books}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

      <LoginForm 
        show={page === 'login'}
        login={login}
        setPage={setPage}
        getUser={() => getUser()}
        setToken={(token) => setToken(token)}
      />

      <RecommendedBooks 
        show={page === 'recommendedBooks'}
        result={books}
        user={user}
      />
    </div>
  )
}

export default App