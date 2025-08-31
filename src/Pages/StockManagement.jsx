import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2"; // Import SweetAlert2
import shoesIcon from "../assets/running-shoes.gif";

const StockManagement = () => {
  const [stock, setStock] = useState([]);
  const [filteredStock, setFilteredStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilterType, setDateFilterType] = useState("all");
  const [customDate, setCustomDate] = useState("");
  const [stockStatus, setStockStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(
          `https://shoes-pos-server.vercel.app/api/shoes`
        );
        setStock(res.data);
        setFilteredStock(res.data);
      } catch (err) {
        console.error("Failed to load stock data:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load stock data!",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  const categories = [
    ...new Set(stock.map((item) => item.category).filter(Boolean)),
  ];

  const isDateInLastDays = (date, days) => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setDate(now.getDate() - days);
    return new Date(date) >= pastDate && new Date(date) <= now;
  };

  const isDateInCurrentMonth = (date) => {
    const now = new Date();
    const d = new Date(date);
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  };

  const isDateInCurrentYear = (date) => {
    const now = new Date();
    const d = new Date(date);
    return d.getFullYear() === now.getFullYear();
  };

  useEffect(() => {
    const term = search.toLowerCase();
    const filtered = stock.filter((item) => {
      const matchSearch =
        item.shoeName.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        (item.articleNumber?.toLowerCase().includes(term) ?? false) ||
        item.color.toLowerCase().includes(term) ||
        item.size.toString().includes(term);

      const itemDate = new Date(item.createdAt);
      let matchDate = true;
      const now = new Date();

      switch (dateFilterType) {
        case "daily":
          matchDate = itemDate.toDateString() === now.toDateString();
          break;
        case "weekly":
          matchDate = isDateInLastDays(itemDate, 7);
          break;
        case "monthly":
          matchDate = isDateInCurrentMonth(itemDate);
          break;
        case "yearly":
          matchDate = isDateInCurrentYear(itemDate);
          break;
        case "custom":
          if (customDate) {
            matchDate = itemDate.toISOString().split("T")[0] === customDate;
          } else {
            matchDate = true;
          }
          break;
        case "all":
        default:
          matchDate = true;
      }

      const matchStockStatus =
        stockStatus === "all"
          ? true
          : stockStatus === "in"
          ? item.quantity > 0
          : item.quantity === 0;

      const matchCategory = selectedCategory
        ? item.category === selectedCategory
        : true;

      return matchSearch && matchDate && matchStockStatus && matchCategory;
    });
    setFilteredStock(filtered);
  }, [
    search,
    stock,
    dateFilterType,
    customDate,
    stockStatus,
    selectedCategory,
  ]);

  // Handle delete with SweetAlert confirmation
  const handleDeleteClick = (shoe) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You won't be able to revert the deletion of "${shoe.shoeName}"!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // If confirmed, proceed with the deletion
        performDelete(shoe);
      }
    });
  };

  // The actual delete logic
  const performDelete = async (shoe) => {
    try {
      await axios.delete(
        `https://shoes-pos-server.vercel.app/api/shoes/${shoe._id}`
      );
      // Update state to remove the deleted shoe from the UI instantly
      setStock(stock.filter((s) => s._id !== shoe._id));
      Swal.fire(
        "Deleted!",
        "The shoe has been deleted successfully.",
        "success"
      );
    } catch (err) {
      console.error("Failed to delete shoe:", err);
      Swal.fire("Error!", "Failed to delete the shoe.", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">
        📦 Stock Management
      </h2>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name, brand, size..."
          className="border px-4 py-2 rounded w-full lg:col-span-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded w-full"
          value={dateFilterType}
          onChange={(e) => setDateFilterType(e.target.value)}
        >
          <option value="all">All Dates</option>
          <option value="daily">Daily</option>
          <option value="weekly">Last 7 Days</option>
          <option value="monthly">This Month</option>
          <option value="yearly">This Year</option>
          <option value="custom">Custom Date</option>
        </select>
        {dateFilterType === "custom" && (
          <input
            type="date"
            className="border px-4 py-2 rounded w-full"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
          />
        )}
        <select
          className="border px-4 py-2 rounded w-full"
          value={stockStatus}
          onChange={(e) => setStockStatus(e.target.value)}
        >
          <option value="all">All Stock Status</option>
          <option value="in">In Stock</option>
          <option value="out">Out of Stock</option>
        </select>
        <select
          className="border px-4 py-2 rounded w-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-xl font-semibold text-gray-600">
          <img src={shoesIcon} alt="Loading..." className="h-22 w-22" />
        </div>
      ) : filteredStock.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-10">
          No stock found matching the criteria.
        </p>
      ) : (
        <div className="overflow-x-auto rounded shadow-md border border-gray-200">
          <table className="table-auto w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Shoe Name",
                  "Brand",
                  "Article",
                  "Color",
                  "Size",
                  "Qty",
                  "Price/Pair (৳)",
                  "Total Value",
                  "Added At",
                  "Category",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="border p-2 whitespace-nowrap text-sm font-semibold text-gray-600 uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredStock.map((shoe) => (
                <tr
                  key={shoe._id}
                  className={`text-center hover:bg-gray-50 ${
                    shoe.quantity === 0 ? "bg-red-50 text-red-700" : ""
                  }`}
                >
                  <td className="border p-2 whitespace-nowrap">
                    {shoe.shoeName}
                  </td>
                  <td className="border p-2 whitespace-nowrap">{shoe.brand}</td>
                  <td className="border p-2 whitespace-nowrap">
                    {shoe.articleNumber || "N/A"}
                  </td>
                  <td className="border p-2 whitespace-nowrap">{shoe.color}</td>
                  <td className="border p-2 whitespace-nowrap">{shoe.size}</td>
                  <td className="border p-2 whitespace-nowrap font-bold">
                    {shoe.quantity}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    {shoe.pricePerPair.toFixed(2)} ৳
                  </td>
                  <td className="border p-2 font-semibold text-green-700 whitespace-nowrap">
                    {(shoe.quantity * shoe.pricePerPair).toFixed(2)} ৳
                  </td>
                  <td className="border p-2 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(shoe.createdAt).toLocaleString("en-BD", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    {shoe.category || "N/A"}
                  </td>
                  <td className="border p-2 whitespace-nowrap">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => navigate(`/update-shoe/${shoe._id}`)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full text-xs"
                        aria-label="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(shoe)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full text-xs"
                        aria-label="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StockManagement;
