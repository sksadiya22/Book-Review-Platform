import { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("/auth/login", form);
    login(res.data.user, res.data.token);
    navigate("/");
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={handleSubmit} className="w-96 bg-white shadow p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input className="border p-2 w-full mb-3" placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="border p-2 w-full mb-3" type="password" placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-blue-500 text-white w-full py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
