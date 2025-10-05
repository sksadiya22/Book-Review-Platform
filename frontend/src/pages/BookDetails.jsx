import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [review, setReview] = useState({ rating: 5, reviewText: "" });

  useEffect(() => {
    axios.get(`/books/${id}`).then((res) => setBook(res.data));
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    await axios.post(`/books/${id}/reviews`, review);
    const res = await axios.get(`/books/${id}`);
    setBook(res.data);
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{book.title}</h1>
      <p>{book.description}</p>
      <p className="text-gray-600">{book.genre} | {book.year}</p>
      <h2 className="text-2xl mt-4">Reviews (Avg: {book.avgRating || 0})</h2>
      {book.reviews?.map((r) => (
        <div key={r._id} className="border p-2 mt-2">
          <strong>{r.userId.name}</strong> ⭐ {r.rating}
          <p>{r.reviewText}</p>
        </div>
      ))}
      <form onSubmit={handleReview} className="mt-4">
        <select onChange={(e) => setReview({ ...review, rating: e.target.value })}>
          {[1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
        </select>
        <textarea className="border p-2 w-full mt-2"
          placeholder="Write review..."
          onChange={(e) => setReview({ ...review, reviewText: e.target.value })} />
        <button className="bg-green-500 text-white px-4 py-2 mt-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default BookDetails;
