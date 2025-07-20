import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SellForm = () => {
  const [cart, setCart] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  const handleAddProduct = async () => {
    const code = barcode.trim();
    if (!code) return alert("Please enter or scan a barcode");

    const existingIndex = cart.findIndex((item) => item.barcode === code);

    if (existingIndex !== -1) {
      const newCart = [...cart];
      const item = newCart[existingIndex];
      if (item.qty + 1 > item.quantity) {
        alert("Stock limit exceeded!");
      } else {
        item.qty += 1;
        item.total = item.price * item.qty - item.discount;
        setCart(newCart);
        calculateSubtotal(newCart);
      }
    } else {
      try {
        const res = await fetch(
          `https://shoes-pos-server.vercel.app/api/shoes/barcode/${code}`
        );
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();

        const newItem = {
          barcode: code,
          name: data.shoeName,
          brand: data.brand || "",
          size: data.size,
          price: data.pricePerPair,
          quantity: data.stock,
          qty: 1,
          discount: 0,
          total: data.pricePerPair,
        };

        const newCart = [...cart, newItem];
        setCart(newCart);
        calculateSubtotal(newCart);
      } catch (err) {
        alert(err.message);
      }
    }

    setBarcode("");
  };

  const calculateSubtotal = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + item.total, 0);
    setSubtotal(total);
  };

  const handleQtyChange = (index, value) => {
    const newCart = [...cart];
    const qty = parseInt(value);
    if (qty < 1) return;
    if (qty > newCart[index].quantity) {
      alert("Stock limit exceeded!");
      return;
    }
    newCart[index].qty = qty;
    newCart[index].total =
      Number(newCart[index].price) * qty - Number(newCart[index].discount || 0);
    setCart(newCart);
    calculateSubtotal(newCart);
  };

  const handleDiscountChange = (index, value) => {
    const newCart = [...cart];
    const discount = parseFloat(value) || 0;
    if (discount < 0) return;
    if (discount > Number(newCart[index].price) * newCart[index].qty) {
      alert("Discount cannot exceed total price");
      return;
    }
    newCart[index].discount = discount;
    newCart[index].total =
      Number(newCart[index].price) * newCart[index].qty - discount;
    setCart(newCart);
    calculateSubtotal(newCart);
  };

  const removeRow = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    calculateSubtotal(newCart);
  };

  const handleSubmit = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const formattedCart = cart.map((item) => ({
        barcode: item.barcode,
        qty: item.qty,
        price: item.price,
        discount: item.discount || 0,
        brand: item.brand,
      }));

      const res = await fetch(`https://shoes-pos-server.vercel.app/api/sell`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart: formattedCart }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.message || "Sale failed");
        return;
      }

      const result = await res.json();
      const saleId = result.saleId;

      if (!saleId) {
        alert("Sale completed but no invoice ID returned.");
        return;
      }

      setCart([]);
      setSubtotal(0);

      navigate(`/invoice/${saleId}`);
    } catch (err) {
      console.log(err.message);
      alert("Sale failed. Try again.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8  rounded-lg">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
        Sale Form
      </h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Scan or enter barcode"
          onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
          autoFocus
          spellCheck={false}
          className="flex-grow border border-gray-300 rounded-lg px-4 py-3 text-lg md:text-xl
            focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        />
        <button
          onClick={handleAddProduct}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg md:text-xl px-8 py-3 rounded-lg
            transition-transform hover:scale-105 shadow"
          type="button"
        >
          Add
        </button>
      </div>

      {cart.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
          <table className="w-full min-w-[900px] table-auto text-left border-collapse">
            <thead className="bg-indigo-100">
              <tr>
                {[
                  "SL",
                  "Name",
                  "Brand",
                  "Size",
                  "Price (৳)",
                  "Stock",
                  "Qty",
                  "Discount",
                  "Total",
                  "Remove",
                ].map((header) => (
                  <th
                    key={header}
                    className="border-b border-gray-300 px-4 py-3 text-base md:text-lg font-semibold text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cart.map((item, idx) => (
                <tr key={item.barcode} className="even:bg-gray-50  transition">
                  <td className="border-b border-gray-300 px-4 py-3 text-base md:text-lg font-semibold">
                    {idx + 1}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3 text-base md:text-lg truncate max-w-xs">
                    {item.name}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3 text-base md:text-lg">
                    {item.brand}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3 text-base md:text-lg text-center">
                    {item.size}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3 text-base md:text-lg text-center">
                    {item.price.toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3 text-base md:text-lg text-center">
                    {item.quantity}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      min="1"
                      max={item.quantity}
                      value={item.qty}
                      onChange={(e) => handleQtyChange(idx, e.target.value)}
                      className="w-16 md:w-20 border border-gray-300 rounded-md px-2 py-1 text-base md:text-lg font-semibold
                        focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center"
                    />
                  </td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    <input
                      type="number"
                      min="0"
                      max={item.price * item.qty}
                      value={item.discount}
                      onChange={(e) =>
                        handleDiscountChange(idx, e.target.value)
                      }
                      className="w-20 md:w-24 border border-gray-300 rounded-md px-2 py-1 text-base md:text-lg font-semibold
                        focus:outline-none focus:ring-2 focus:ring-indigo-400 text-center"
                    />
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3 text-base md:text-lg font-bold text-indigo-700 text-center">
                    {item.total.toFixed(2)}
                  </td>
                  <td className="border-b border-gray-300 px-4 py-3 text-center">
                    <button
                      className="text-red-600 font-bold text-2xl hover:text-red-800 transition"
                      onClick={() => removeRow(idx)}
                      aria-label="Remove item"
                    >
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-2xl md:text-3xl font-extrabold text-gray-900 select-none">
          Subtotal: ৳ {subtotal.toFixed(2)}
        </p>
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 rounded-lg
            text-xl md:text-2xl font-semibold shadow-md transition-transform hover:scale-105"
        >
          Sell & Generate Memo
        </button>
      </div>
    </div>
  );
};

export default SellForm;
