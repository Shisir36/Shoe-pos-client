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
        const res = await fetch(`http://localhost:5173/api/shoes/barcode/${code}`);
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

      const res = await fetch(`http://localhost:5000/api/sell`, {
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

      // Navigate to dynamic route with saleId
      navigate(`/invoice/${saleId}`);
    } catch (err) {
      console.log(err.message);
      alert("Sale failed. Try again.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sale Form</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Scan or enter barcode"
          className="flex-grow border p-2"
          onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
          autoFocus
        />
        <button
          onClick={handleAddProduct}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {cart.length > 0 && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">SL</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Size</th>
              <th className="border p-2">Price (৳)</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item, idx) => (
              <tr key={item.barcode}>
                <td className="border p-2">{idx + 1}</td>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.brand}</td>
                <td className="border p-2">{item.size}</td>
                <td className="border p-2">{item.price}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    min="1"
                    max={item.quantity}
                    value={item.qty}
                    onChange={(e) => handleQtyChange(idx, e.target.value)}
                    className="w-16 border p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    min="0"
                    max={item.price * item.qty}
                    value={item.discount}
                    onChange={(e) => handleDiscountChange(idx, e.target.value)}
                    className="w-20 border p-1"
                  />
                </td>
                <td className="border p-2">{item.total}</td>
                <td className="border p-2 text-center">
                  <button
                    className="text-red-600 font-bold"
                    onClick={() => removeRow(idx)}
                  >
                    ✖
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 text-right">
        <p className="text-xl font-semibold">Subtotal: ৳ {subtotal}</p>
        <button
          onClick={handleSubmit}
          className="mt-2 bg-green-600 text-white px-6 py-2 rounded"
        >
          Sell & Generate Memo
        </button>
      </div>
    </div>
  );
};

export default SellForm;
