import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SellHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState(new Set());

  // Filter state
  const [filterType, setFilterType] = useState(""); // daily, weekly, monthly, yearly, custom, or empty for all
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const contentRef = useRef();
  const navigate = useNavigate();
  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const [totalAmount, setTotalAmount] = useState(0); // Add this new state

  const fetchSales = async (from, to) => {
    setLoading(true);
    try {
      let url = `https://shoes-pos-server.vercel.app/api/sales`;
      if (from && to) {
        url += `?from=${from}&to=${to}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setSales(data.sales || []);
      setTotalAmount(data.totalAmount || 0); // Set total amount here
    } catch (err) {
      console.error("Failed to fetch sales history:", err);
    } finally {
      setLoading(false);
    }
  };
  const applyFilter = (type) => {
    let from, to;
    const today = new Date();

    switch (type) {
      case "daily":
        from = to = formatDate(today);
        break;
      case "weekly": {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 6);
        from = formatDate(lastWeek);
        to = formatDate(today);
        break;
      }
      case "monthly":
        from = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        to = formatDate(today);
        break;
      case "yearly":
        from = formatDate(new Date(today.getFullYear(), 0, 1));
        to = formatDate(today);
        break;
      case "custom":
        if (!fromDate || !toDate) {
          alert("Please select both From and To dates for custom filter.");
          return;
        }
        from = fromDate;
        to = toDate;
        break;
      case "all":
      default:
        from = to = null;
    }

    setFilterType(type);

    if (!from || !to) {
      // No date filter, fetch all sales
      fetchSales();
      setFromDate("");
      setToDate("");
    } else {
      fetchSales(from, to);
      if (type !== "custom") {
        setFromDate("");
        setToDate("");
      }
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Handle dropdown change
  const handleDropdownChange = (e) => {
    const val = e.target.value;
    if (val === "custom") {
      setFilterType(val);
      // Wait for user to input dates and then apply via button
    } else {
      applyFilter(val);
    }
  };

  // Handle applying custom date filter on button click
  const applyCustomFilter = () => {
    applyFilter("custom");
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div
      className="max-w-7xl mx-auto p-6 print:bg-white bg-white rounded shadow-md"
      ref={contentRef}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
        🧾 All Sell History
      </h2>

      {/* Dropdown for filters */}
      <div className="mb-4 flex flex-col items-center print:hidden space-y-2">
        <select
          value={filterType}
          onChange={handleDropdownChange}
          className="border p-2 rounded w-48 text-center"
        >
          <option value="">All Sales (No Filter)</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="custom">Custom Range</option>
        </select>

        {filterType === "custom" && (
          <div className="flex space-x-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate || undefined}
              className="border p-1 rounded"
              placeholder="From Date"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
              className="border p-1 rounded"
              placeholder="To Date"
            />
            <button
              onClick={applyCustomFilter}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Print button */}

      {loading ? (
        <div className="h-[300px] flex items-center justify-center text-xl font-semibold text-gray-600">
          🔄 Loading Sell History...
        </div>
      ) : sales.length === 0 ? (
        <p className="text-lg text-center text-gray-500">No sales found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-base border border-gray-200 rounded shadow-sm">
            <thead className="bg-gray-100 text-gray-800 text-center">
              <tr>
                <th className="py-3 px-2">#</th>
                <th className="py-3 px-2">Invoice ID</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Item</th>
                <th className="py-3 px-2">Size</th>
                <th className="py-3 px-2">Brand</th>
                <th className="py-3 px-2">Qty</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Discount</th>
                <th className="py-3 px-2">Total</th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => {
                const saleTime = new Date(sale.soldAt).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                });

                const isExpanded = expandedIds.has(sale._id);

                if (sale.items.length === 1) {
                  const item = sale.items[0];
                  return (
                    <tr
                      key={sale._id}
                      className="text-center border-t hover:bg-gray-50"
                    >
                      <td className="py-3 px-2">{index + 1}</td>
                      <td className="py-3 px-2 text-blue-600">{sale._id}</td>
                      <td className="py-3 px-2">{saleTime}</td>
                      <td className="py-3 px-2">{item.shoeInfo.shoeName}</td>
                      <td className="py-3 px-2">{item.shoeInfo.size}</td>
                      <td className="py-3 px-2">{item.shoeInfo.brand}</td>
                      <td className="py-3 px-2">{item.quantity}</td>
                      <td className="py-3 px-2">
                        ৳ {item.sellPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        ৳ {item.discount.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 font-semibold text-green-700">
                        ৳ {item.totalAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => navigate(`/sale/${sale._id}`)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                        >
                          ✏️ Update
                        </button>
                      </td>
                    </tr>
                  );
                } else {
                  const totalQty = sale.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );
                  const grandTotal = sale.items.reduce(
                    (sum, item) => sum + item.totalAmount,
                    0
                  );

                  return (
                    <React.Fragment key={sale._id}>
                      <tr className="text-center border-t hover:bg-gray-50">
                        <td className="py-3 px-2">{index + 1}</td>
                        <td className="py-3 px-2 text-blue-600">{sale._id}</td>
                        <td className="py-3 px-2">{saleTime}</td>
                        <td className="py-3 px-2 text-left" colSpan={5}>
                          Total Items: {sale.items.length}
                        </td>
                        <td className="py-3 px-2">{totalQty}</td>
                        <td className="py-3 px-2 text-green-700 font-semibold">
                          ৳ {grandTotal.toFixed(2)}
                        </td>
                        <td className="py-3 px-2 space-x-2">
                          <button
                            onClick={() => toggleExpand(sale._id)}
                            className="bg-gray-300 px-2 rounded hover:bg-gray-400"
                            title={isExpanded ? "Collapse" : "Expand"}
                          >
                            {isExpanded ? "−" : "+"}
                          </button>
                          <button
                            onClick={() => navigate(`/sale/${sale._id}`)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                          >
                            ✏️ Update
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr>
                          <td colSpan="11" className="bg-gray-50 p-2">
                            <table className="w-full text-sm border">
                              <thead className="bg-gray-200 text-center">
                                <tr>
                                  <th className="py-1 px-2 text-left">
                                    Item Name
                                  </th>
                                  <th className="py-1 px-2">Size</th>
                                  <th className="py-1 px-2">Brand</th>
                                  <th className="py-1 px-2">Qty</th>
                                  <th className="py-1 px-2">Price</th>
                                  <th className="py-1 px-2">Discount</th>
                                  <th className="py-1 px-2">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sale.items.map((item, i) => (
                                  <tr key={i} className="text-center border-t">
                                    <td className="text-left py-1 px-2">
                                      {item.shoeInfo.shoeName}
                                    </td>
                                    <td className="py-1 px-2">
                                      {item.shoeInfo.size}
                                    </td>
                                    <td className="py-1 px-2">
                                      {item.shoeInfo.brand}
                                    </td>
                                    <td className="py-1 px-2">
                                      {item.quantity}
                                    </td>
                                    <td className="py-1 px-2">
                                      ৳ {item.sellPrice.toFixed(2)}
                                    </td>
                                    <td className="py-1 px-2">
                                      ৳ {item.discount.toFixed(2)}
                                    </td>
                                    <td className="py-1 px-2 font-semibold text-green-700">
                                      ৳ {item.totalAmount.toFixed(2)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }
              })}
            </tbody>
          </table>
          {sales.length > 0 && (
            <div className="text-lg font-semibold text-right my-3 text-green-700">
              ✅ Total Sales: ৳ {totalAmount.toFixed(2)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellHistory;
