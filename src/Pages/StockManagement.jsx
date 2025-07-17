import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const StockManagement = () => {
  const [stock, setStock] = useState([]);
  const [filteredStock, setFilteredStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [stockStatus, setStockStatus] = useState("all");
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/shoes`);
        setStock(res.data);
        setFilteredStock(res.data);
      } catch (err) {
        console.error("Failed to load stock data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = stock.filter((item) => {
      const matchSearch =
        item.shoeName.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.articleNumber?.toLowerCase().includes(term) ||
        item.color.toLowerCase().includes(term) ||
        item.size.toString().includes(term);

      const matchDate = filterDate
        ? new Date(item.createdAt).toISOString().split("T")[0] === filterDate
        : true;

      const matchStockStatus =
        stockStatus === "all"
          ? true
          : stockStatus === "in"
          ? item.quantity > 0
          : item.quantity === 0;

      return matchSearch && matchDate && matchStockStatus;
    });

    setFilteredStock(filtered);
  }, [search, stock, filterDate, stockStatus]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        📦 Stock Management
      </h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 justify-center">
        <input
          type="text"
          placeholder="Search by name, brand, size..."
          className="border px-4 py-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="border px-4 py-2 rounded w-full"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded w-full"
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-lg">
          Loading...
        </div>
      ) : (
        <table className="table-auto w-full border-collapse shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Shoe Name</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Article</th>
              <th className="border p-2">Color</th>
              <th className="border p-2">Size</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price/Pair (৳)</th>
              <th className="border p-2">Total Value</th>
              <th className="border p-2">Added At</th>
            </tr>
          </thead>
          <tbody>
            {filteredStock.map((shoe, index) => (
              <tr
                key={index}
                className={`text-center ${
                  shoe.quantity === 0 ? "bg-red-50 text-red-600" : ""
                }`}
              >
                <td className="border p-2">{shoe.shoeName}</td>
                <td className="border p-2">{shoe.brand}</td>
                <td className="border p-2">{shoe.articleNumber || "N/A"}</td>
                <td className="border p-2">{shoe.color}</td>
                <td className="border p-2">{shoe.size}</td>
                <td className="border p-2">{shoe.quantity}</td>
                <td className="border p-2">{shoe.pricePerPair} ৳</td>
                <td className="border p-2 font-semibold text-green-700">
                  {shoe.quantity * shoe.pricePerPair} ৳
                </td>
                <td className="border p-2 text-sm text-gray-600">
                  {new Date(shoe.createdAt).toLocaleString("en-BD", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StockManagement;
