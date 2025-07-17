import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const SellHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const contentRef  = useRef();

  const handlePrint = useReactToPrint({ contentRef });
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/sales`);
        const data = await res.json();
        setSales(data);
      } catch (err) {
        console.error("Failed to fetch sales history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-lg">
        Loading Sell History...
      </div>
    );
  }

  // sales থেকে সব items একসাথে নিয়ে serial number জন্য একটা array বানাচ্ছি
  let serialNumber = 1;

  return (
    <div className="max-w-7xl mx-auto p-4 print:bg-white" ref={contentRef}>
      <h2 className="text-2xl font-bold mb-6 text-center">
        🧾 All Sell History
      </h2>

      <div className="print:hidden text-center mb-4">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          প্রিন্ট করুন
        </button>
      </div>

      {sales.length === 0 ? (
        <p>No sales found.</p>
      ) : (
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100 border-b text-center">
              <th className="py-3 px-1">#</th>
              <th className="py-3 px-1">Invoice ID</th>
              <th className="py-3 px-1">Date</th>
              <th className="py-3 px-1 text-left">Item</th>{" "}
              {/* নাম, বাম পাশে ঠিক আছে */}
              <th className="py-3 px-1 text-center">Size</th>
              <th className="py-3 px-1 text-center">Brand</th>
              <th className="py-3 px-1 text-center">Qty</th>
              <th className="py-3 px-1 text-center">Price</th>
              <th className="py-3 px-1 text-center">Discount</th>
              <th className="py-3 px-1 text-center">Total</th>
              <th className="py-3 px-1 text-center">Update</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => {
              const saleTime = new Date(sale.soldAt).toLocaleString("en-BD", {
                dateStyle: "medium",
                timeStyle: "short",
              });

              return sale.items.map((item, i) => (
                <tr
                  key={`${sale._id}-${i}`}
                  className="border-b  border-gray-200"
                >
                  <td className="py-3 px-1 text-center align-middle">
                    {serialNumber++}
                  </td>
                  <td className="py-3 px-1 text-center align-middle">
                    {sale._id}
                  </td>
                  <td className="py-3 px-1 text-center align-middle">
                    {saleTime}
                  </td>
                  <td className="py-3 px-1 text-left align-middle">
                    {item.shoeInfo.shoeName}
                  </td>
                  <td className="py-3 px-1 text-center align-middle">
                    {item.shoeInfo.size}
                  </td>
                  <td className="py-3 px-1 text-center align-middle">
                    {item.shoeInfo.brand}
                  </td>
                  <td className="py-3 px-1 text-center align-middle">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-1 text-center align-middle">
                    ৳ {item.sellPrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-1 text-center align-middle">
                    ৳ {item.discount.toFixed(2)}
                  </td>
                  <td className="py-3 px-1 text-center align-middle">
                    ৳ {item.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-1 text-center align-middle">
                    <button
                      onClick={() => navigate(`/sales/${sale._id}/item/${i}`)}
                      className="bg-yellow-500 text-white  px-2 rounded hover:bg-yellow-600 transition"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SellHistory;
