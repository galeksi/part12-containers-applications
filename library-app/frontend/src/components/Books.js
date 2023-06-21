import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genre, setGenre] = useState("");
  const books = useQuery(ALL_BOOKS);
  const booksByGenre = useQuery(ALL_BOOKS, {
    variables: {
      genre: genre,
    },
  });
  // console.log(books);

  if (!props.show) {
    return null;
  }

  if (books.loading || booksByGenre.loading) {
    return <div>loading...</div>;
  }

  // const filterBooks = (genre) => {
  //   const filteredBooks = books.data.allBooks.filter((b) =>
  //     b.genres.includes(genre)
  //   );
  //   return filteredBooks;
  // };

  const genres = books.data.allBooks.reduce((a, b) => {
    return a.concat(b.genres.filter((genre) => a.indexOf(genre) < 0));
  }, []);
  // console.log(genres);

  const booksToShow =
    genre === "" ? books.data.allBooks : booksByGenre.data.allBooks;

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>filter by genre</h3>
      {genres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setGenre("")}>
        <b>all genres</b>
      </button>
    </div>
  );
};

export default Books;
