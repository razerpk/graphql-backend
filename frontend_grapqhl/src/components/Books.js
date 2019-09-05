import React, { useState } from 'react'

const Books = ({ show, result }) => {
  const [genre, setGenre] = useState('')

  if (!show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks
  // if genre is selected, find all that genres books
  const showByGenreBooks = books.filter(book => book.genres.includes(genre))

  let allGenres = []
  // Find all genres from the books
  books.map(book => {
    book.genres.map(genre => {
      if (!allGenres.includes(genre))
        allGenres.push(genre)
      return null
    })
    return null
  })

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>
              title
            </th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {genre === '' 
            ? books.map(book => // lists all books
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            )
            : showByGenreBooks.map(book => // lists all the books that fits the selected genre
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            )
          }
        </tbody>
      </table>
      <div>
        {allGenres.map(genre => // Create all the genre buttons
          <button key={genre} onClick={() => setGenre(genre)}>{genre}</button>
        )}
        <button onClick={() => setGenre('')}>All Genres</button>
      </div>
    </div>
  )
}

export default Books