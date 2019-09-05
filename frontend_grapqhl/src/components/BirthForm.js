import React, { useState } from 'react'

const BirthForm = ({ editAuthor, authors }) => {
  const [name, setName] = useState(authors[0].name)
  const [born, setBorn] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    await editAuthor({
      variables: { name, born }
    })

    setBorn('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <select value={name} onChange={({ target }) => setName(target.value)}>
          {authors.map(author =>
            <option key={author.id} value={author.name}>{author.name}</option>
          )}
        </select>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default BirthForm