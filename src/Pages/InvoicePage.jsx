import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const InvoicePage = () => {
  const { saleId } = useParams();
  const [saleData, setSaleData] = React.useState(null);
  const navigate = useNavigate();
  const printRef = useRef();

  React.useEffect(() => {
    const fetchSale = async () => {
      try {
        const res = await fetch(
          `https://shoes-pos-server.vercel.app/api/sales/${saleId}`
        );
        if (!res.ok) {
          alert("Sale data not found");
          navigate("/");
          return;
        }
        const data = await res.json();
        setSaleData(data);
      } catch (err) {
        alert("Failed to fetch sale data: " + err.message);
        navigate("/");
      }
    };
    fetchSale();
  }, [saleId, navigate]);


  const handlePrint = useReactToPrint({ content: () => printRef.current });

  if (!saleData) return <div>Loading invoice...</div>;

  const grandTotal = saleData.items.reduce(
    (acc, item) => acc + item.totalAmount,
    0
  );
  const totalDiscount = saleData.items.reduce(
    (acc, item) => acc + (item.discount || 0),
    0
  );

  return (
    <div className="max-w-xl mx-auto p-4">
      <div ref={printRef} className="p-6 border border-gray-300 shadow bg-white font-mono text-sm">
        {/* Store Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold">Your Shop Name</h2>
          <p>123, Street Name, City</p>
          <p>Phone: 0123456789</p>
          <p>Email: info@yourshop.com</p>
        </div>

        {/* Invoice Info */}
        <div className="mb-4 flex justify-between text-sm">
          <div>
            <p><strong>Invoice ID:</strong> {saleId}</p>
            <p><strong>Date:</strong> {new Date(saleData.soldAt).toLocaleString()}</p>
          </div>
          <div>
            <p><strong>Cashier:</strong> {/* Add if needed */}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse border text-left mb-4">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-1 px-2">#</th>
              <th className="py-1 px-2">Item</th>
              <th className="py-1 px-2">Size</th>
              <th className="py-1 px-2 text-center">Qty</th>
              <th className="py-1 px-2 text-right">Price</th>
              <th className="py-1 px-2 text-right">Discount</th>
              <th className="py-1 px-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {saleData.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-200">
                <td className="py-1 px-2">{idx + 1}</td>
                <td className="py-1 px-2">{item.shoeInfo.shoeName}</td>
                <td className="py-1 px-2">{item.shoeInfo.size}</td>
                <td className="py-1 px-2 text-center">{item.quantity}</td>
                <td className="py-1 px-2 text-right">৳ {item.sellPrice.toFixed(2)}</td>
                <td className="py-1 px-2 text-right">৳ {item.discount.toFixed(2)}</td>
                <td className="py-1 px-2 text-right">৳ {item.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="text-right border-t border-gray-300 pt-2">
          <p><strong>Total Discount:</strong> ৳ {totalDiscount.toFixed(2)}</p>
          <p className="text-lg font-bold">Grand Total: ৳ {grandTotal.toFixed(2)}</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-600">
          <p>Thank you for shopping with us!</p>
          <p>Return/Exchange within 7 days with this receipt.</p>
        </div>
      </div>

      {/* Print button */}
      <div className="text-center mt-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
};

export default InvoicePage;
