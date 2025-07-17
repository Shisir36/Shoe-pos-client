import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateSaleItem = () => {
  const { saleId, itemIndex } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [sale, setSale] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [sellPrice, setSellPrice] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/sales/${saleId}`);
        if (!res.ok) throw new Error("Sale not found");
        const data = await res.json();

        setSale(data);
        const item = data.items[Number(itemIndex)];
        if (!item) throw new Error("Item not found");

        setQuantity(item.quantity);
        setSellPrice(item.sellPrice);
        setDiscount(item.discount || 0);
      } catch (error) {
        alert(error.message);
        navigate("/sell-history");
      } finally {
        setLoading(false);
      }
    };

    fetchSale();
  }, [saleId, itemIndex, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (quantity <= 0 || sellPrice <= 0 || discount < 0) {
      alert("Invalid input values");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/sales/${saleId}/item/${itemIndex}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity,
            sellPrice,
            discount,
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Update failed");
      }

      alert("Sale item updated successfully");
      navigate("/sell-history");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading sale data...</div>;
  }

  if (!sale) {
    return null; // Already handled redirect in useEffect
  }

  const item = sale.items[Number(itemIndex)];
  if (!item) {
    return <div className="p-4 text-center">Item not found</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4 text-center">Update Sale Item</h2>

      <p className="mb-4 text-center font-semibold">
        {item.shoeInfo.brand}-{item.shoeInfo.shoeName} (Size: {item.shoeInfo.size})
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Sell Price (৳)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={sellPrice}
            onChange={(e) => setSellPrice(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Discount (৳)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Update Item
        </button>
      </form>
    </div>
  );
};

export default UpdateSaleItem;
