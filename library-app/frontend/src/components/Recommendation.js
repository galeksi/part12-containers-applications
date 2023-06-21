import { useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { ALL_BOOKS, CURRENT_USER } from "../queries";

const Recommendation = ({ show, token }) => {
  const [books, setBooks] = useState([]);

  const [getCurrentUser] = useLazyQuery(CURRENT_USER, {
    onCompleted: (data) => {
      if (data.me) {
        getBooksByGenre({ variables: { genre: data.me.favouriteGenre } });
      }
    },
  });

  const [getBooksByGenre] = useLazyQuery(ALL_BOOKS, {
    onCompleted: (data) => {
      setBooks(data.allBooks);
    },
  });

  useEffect(() => {
    if (token) getCurrentUser();
  }, [getCurrentUser, token]);

  if (!show) {
    return null;
  }

  return (
    <div>
      <h2>recommendations</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendation;
