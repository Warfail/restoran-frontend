import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("token", "dummy");
      navigate("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600">
      <div className="bg-white p-8 rounded-lg">
        <h1 className="text-2xl font-bold">Login</h1>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Username" className="border p-2 my-2 w-full" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="Password" className="border p-2 my-2 w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="bg-green-600 text-white p-2 w-full rounded">Login</button>
        </form>
      </div>
    </div>
  );
}