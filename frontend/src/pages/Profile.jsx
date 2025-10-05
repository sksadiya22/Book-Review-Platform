import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const [myBooks, setMyBooks] = useState([]);
  const [myReviews, setMyReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const booksRes = await axios.get(`/books?author=${user.name}`);
      setMyBooks(booksRes.data);

      const reviewsRes = await axios.get(`/users/${user._id}/reviews`);
      setMyReviews(reviewsRes.data);
    };
    fetchData();
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{user.name}’s Profile</h1>
      
      <h2 className="text-2xl font-semibold mt-6">My Books</h2>
      {myBooks.length === 0 && <p>No books added yet.</p>}
      <div className="grid grid-cols-2 gap-4 mt-2">
        {myBooks.map((b) => (
          <Link key={b._id} to={`/books/${b._id}`} className="border p-4 rounded shadow">
            <h3 className="font-bold">{b.title}</h3>
            <p>{b.genre}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-6">My Reviews</h2>
      {myReviews.length === 0 && <p>No reviews yet.</p>}
      {myReviews.map((r) => (
        <div key={r._id} className="border p-2 mt-2">
          <p><strong>{r.bookId.title}</strong> – ⭐ {r.rating}</p>
          <p>{r.reviewText}</p>
        </div>
      ))}
    </div>
  );
};

export default Profile;
