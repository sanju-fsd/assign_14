import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch customers
  const fetchCustomers = async () => {
    const res = await API.get("/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Add / Update customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await API.put(`/customers/${editId}`, form);
    } else {
      await API.post("/customers", form);
    }

    setForm({ name: "", email: "", phone: "", company: "" });
    setEditId(null);
    fetchCustomers();
  };

  // Edit
  const handleEdit = (customer) => {
    setForm(customer);
    setEditId(customer._id);
  };

  // Delete
  const handleDelete = async (id) => {
    if (confirm("Delete this customer?")) {
      await API.delete(`/customers/${id}`);
      fetchCustomers();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Dashboard</h1>

      {/* ADD / EDIT FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow mb-6"
      >
        <input
          placeholder="Name"
          className="border p-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          className="border p-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Phone"
          type="number"
          className="border p-2"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Company"
          className="border p-2"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />

        <button className="col-span-2 bg-blue-600 text-white py-2 rounded">
          {editId ? "Update Customer" : "Add Customer"}
        </button>
      </form>

      {/* CUSTOMER TABLE */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c._id} className="border-t text-center">
              <td className="p-2">{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.company}</td>
              <td className="space-x-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
