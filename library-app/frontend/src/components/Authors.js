import { useState } from "react";
import Select from "react-select";
import { useMutation, useQuery } from "@apollo/client";
import { ALL_AUTHORS, UPDATE_AUTHOR } from "../queries";

const Authors = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const authors = useQuery(ALL_AUTHORS);
  const [changeBirthdate] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  if (authors.loading) {
    return <div>loading...</div>;
  }

  const authorOptions = authors.data.allAuthors.map((a) => ({
    value: a.name,
    label: a.name,
  }));

  const update = (event) => {
    event.preventDefault();

    changeBirthdate({ variables: { name: name.value, setBornTo: born } });

    setName("");
    setBorn("");
  };

  // const token = localStorage.getItem("user-token");

  const setBirthyear = () => {
    return (
      <div>
        <h2>Set birthyear</h2>
        <div>
          <form onSubmit={update}>
            <div>
              <Select
                defaultValue={name}
                onChange={setName}
                options={authorOptions}
              />
            </div>
            <div>
              born
              <input
                value={born}
                onChange={({ target }) => setBorn(parseInt(target.value))}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.token ? setBirthyear() : null}
    </div>
  );
};

export default Authors;
