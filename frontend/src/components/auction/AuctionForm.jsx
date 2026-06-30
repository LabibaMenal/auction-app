import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const AuctionForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    title: "", description: "", image: "", startingPrice: "", reservePrice: "", endTime: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.startingPrice || !form.endTime) {
      setError("Title, starting price, and end time are required.");
      return;
    }
    try {
      const { data: auction } = await axios.post(`${API_URL}/api/auctions`, {
        ...form,
        startingPrice: Number(form.startingPrice),
        reservePrice: form.reservePrice ? Number(form.reservePrice) : undefined,
        startTime: new Date().toISOString(),
        endTime: new Date(form.endTime).toISOString(),
      });

      await axios.post(`${API_URL}/api/auctions/${auction._id}/start`);

      setError("");
      onCreated();
    } catch (err) {
      setError("Could not create auction. Check the console.");
      console.error(err);
    }
  };

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <input name="title" placeholder="Item title" value={form.title} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="image" placeholder="Image URL (optional)" value={form.image} onChange={handleChange} />
      <div className="form-row">
        <input name="startingPrice" type="number" placeholder="Starting price" value={form.startingPrice} onChange={handleChange} />
        <input name="reservePrice" type="number" placeholder="Reserve price (optional)" value={form.reservePrice} onChange={handleChange} />
      </div>
      <input name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} />
      <button className="btn btn-gold" type="submit">Create auction</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};
export default AuctionForm;