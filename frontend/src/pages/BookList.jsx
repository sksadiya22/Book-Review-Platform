import { useState, useEffect } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios.get(`/books?page=${page}&search=${search}&genre=${genre}`).then((res) => {
      setBooks(res.data);
    });
  }, [search, genre, page]);

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-4">
        <input className="border p-2" placeholder="Search by title/author"
          onChange={(e) => setSearch(e.target.value)} />
        <select className="border p-2" onChange={(e) => setGenre(e.target.value)}>
          <option value="">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="SciFi">Sci-Fi</option>
          <option value="Romance">Romance</option>
        </select>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {books.map((b) => (
          <Link key={b._id} to={`/books/${b._id}`} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{b.title}</h2>
            <p>{b.author}</p>
            <p className="text-sm text-gray-500">{b.genre}</p>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-4 gap-4">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default BookList;
