import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/fruits";

function App() {
  const [fruits, setFruits] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: "", price: "" });

  useEffect(() => {
    fetchFruits();
  }, []);

  const fetchFruits = async () => {
    const res = await axios.get(API_URL);
    setFruits(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, form);
    setForm({ name: "", quantity: "", price: "" });
    fetchFruits();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchFruits();
  };

  return (
    <div>
      <h1>Gyümölcsök Nyilvántartása</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Név" value={form.name} onChange={handleChange} required />
        <input type="number" name="quantity" placeholder="Mennyiség" value={form.quantity} onChange={handleChange} required />
        <input type="number" name="price" placeholder="Ár" value={form.price} onChange={handleChange} required />
        <button type="submit">Hozzáadás</button>
      </form>

      <ul>
        {fruits.map((fruit) => (
          <li key={fruit.id}>
            {fruit.name} - {fruit.quantity} db - {fruit.price} Ft 
            <button onClick={() => handleDelete(fruit.id)}>Törlés</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
