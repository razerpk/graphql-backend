import React from 'react'

const RecommendedBooks = ({ show, result, user }) => {
  if (!show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }

  const books = result.data.allBooks

  const recommendedBooks = books.filter(book => book.genres.includes(user.favoriteGenre))

  return (
    <div>
      <h2>recommendations</h2>
      <div>
        books in your favorite genre <b>{user.favoriteGenre}</b>
      </div>
      <table>
        <tbody>
          <tr>
            <th>
            </th>
            <th>
              <b>author</b>
            </th>
            <th>
              <b>published</b>
            </th>
          </tr>
          {recommendedBooks
            ? recommendedBooks.map(book => 
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            )
            : null
          }
          <tr>

          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default RecommendedBooks