import { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [book, setBook] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/books", book);
    navigate("/");
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={handleSubmit} className="w-96 bg-white shadow p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">Add Book</h2>
        <input className="border p-2 w-full mb-3" placeholder="Title"
          onChange={(e) => setBook({ ...book, title: e.target.value })} />
        <input className="border p-2 w-full mb-3" placeholder="Author"
          onChange={(e) => setBook({ ...book, author: e.target.value })} />
        <input className="border p-2 w-full mb-3" placeholder="Genre"
          onChange={(e) => setBook({ ...book, genre: e.target.value })} />
        <input className="border p-2 w-full mb-3" placeholder="Year"
          onChange={(e) => setBook({ ...book, year: e.target.value })} />
        <textarea className="border p-2 w-full mb-3" placeholder="Description"
          onChange={(e) => setBook({ ...book, description: e.target.value })}></textarea>
        <button className="bg-blue-500 text-white w-full py-2 rounded">Add</button>
      </form>
    </div>
  );
};

export default AddBook;
