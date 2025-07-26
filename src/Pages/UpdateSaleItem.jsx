import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateSaleItem = () => {
  const navigate = useNavigate();
  const { saleId } = useParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
   // store non-item sale info like date, memo

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await fetch(
          `https://shoes-pos-server.vercel.app/api/sales/${saleId}`
        );
        if (!res.ok) throw new Error("Sale not found");
        const data = await res.json();

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

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-extrabold mb-6 text-center text-blue-700">
        Edit Sale
      </h2>

      <form onSubmit={handleSubmit} className="w-full">
        <div className="overflow-x-auto rounded-md border border-gray-300 shadow-sm">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs sm:text-sm">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap text-left">
                  Product
                </th>
                <th className="py-3 px-4 whitespace-nowrap">Size</th>
                <th className="py-3 px-4 whitespace-nowrap">Qty</th>
                <th className="py-3 px-4 whitespace-nowrap">Price</th>
                <th className="py-3 px-4 whitespace-nowrap">Discount</th>
                <th className="py-3 px-4 whitespace-nowrap">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-2 px-4 text-left">
                    {item.shoeInfo.brand} - {item.shoeInfo.shoeName}
                  </td>
                  <td className="py-2 px-4">{item.shoeInfo.size}</td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleChange(idx, "quantity", e.target.value)
                      }
                      className="w-16 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.sellPrice}
                      onChange={(e) =>
                        handleChange(idx, "sellPrice", e.target.value)
                      }
                      className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) =>
                        handleChange(idx, "discount", e.target.value)
                      }
                      className="w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </td>
                  <td className="py-2 px-4 font-semibold text-green-700">
                    ৳ {item.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          className="mt-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateSaleItem;
