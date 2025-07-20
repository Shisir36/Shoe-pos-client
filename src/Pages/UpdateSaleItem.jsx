import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateSaleItem = () => {
  const navigate = useNavigate();
  const { saleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [saleMeta, setSaleMeta] = useState(null); // store non-item sale info like date, memo

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await fetch(
          `https://shoes-pos-server.vercel.app/api/sales/${saleId}`
        );
        if (!res.ok) throw new Error("Sale not found");
        const data = await res.json();

        setSaleMeta({ date: data.date, memoNo: data.memoNo });

        // Add totalAmount calculation
        const updatedItems = data.items.map((item) => ({
          ...item,
          totalAmount: item.quantity * item.sellPrice - item.discount,
        }));

        setItems(updatedItems);
      } catch (error) {
        alert(error.message);
        navigate("/sell-history");
      } finally {
        setLoading(false);
      }
    };
    fetchSale();
  }, [saleId, navigate]);

  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = Number(value);
    updated[index].totalAmount =
      updated[index].quantity * updated[index].sellPrice -
      updated[index].discount;
    setItems(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://shoes-pos-server.vercel.app/api/sales/${saleId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Update failed");
      }

      alert("Sale updated successfully");
      navigate("/sell-history");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-4 text-center">Loading sale...</div>;

  const grandTotal = items.reduce((sum, item) => sum + item.totalAmount, 0);

  return (
    <div className="max-w-4xl mx-auto mt-6 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Edit Full Sale</h2>

      {saleMeta && (
        <div className="mb-4 text-sm text-gray-700 text-center">
          <p>Memo No: {saleMeta.memoNo}</p>
          <p>Date: {new Date(saleMeta.date).toLocaleString()}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th>Product</th>
              <th>Size</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="text-center border-t">
                <td>
                  {item.shoeInfo.brand} - {item.shoeInfo.shoeName}
                </td>
                <td>{item.shoeInfo.size}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(idx, "quantity", e.target.value)
                    }
                    className="w-16 border px-1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.sellPrice}
                    onChange={(e) =>
                      handleChange(idx, "sellPrice", e.target.value)
                    }
                    className="w-20 border px-1"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.discount}
                    onChange={(e) =>
                      handleChange(idx, "discount", e.target.value)
                    }
                    className="w-20 border px-1"
                  />
                </td>
                <td>৳ {item.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-right font-semibold">
          Grand Total: ৳ {grandTotal.toFixed(2)}
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateSaleItem;
