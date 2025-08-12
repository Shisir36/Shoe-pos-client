import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Main component for the Sell Form
const SellForm = () => {
  // State management for the form
  const [cart, setCart] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
 const navigate = useNavigate()
  const handleAddProduct = async () => {
    const code = barcode.trim();
    if (!code) {
      alert("Please enter or scan a barcode");
      return;
    }

    setIsLoading(true);
    const existingIndex = cart.findIndex((item) => item.barcode === code);

    // If item already exists in the cart, update its quantity
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
      // If item is new, fetch its details from the backend
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
          quantity: data.stock, // Available stock
          qty: 1, // Quantity in cart
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
    setIsLoading(false);
  };

  /**
   * Calculates the total price of all items in the cart.
   * @param {Array} cartItems - The array of items in the cart.
   */
  const calculateSubtotal = (cartItems) => {
    const total = cartItems.reduce((acc, item) => acc + item.total, 0);
    setSubtotal(total);
  };

  /**
   * Handles changes to the quantity input for a cart item.
   * @param {number} index - The index of the item in the cart.
   * @param {string} value - The new quantity value from the input.
   */
  const handleQtyChange = (index, value) => {
    const newCart = [...cart];
    const qty = parseInt(value);
    if (isNaN(qty) || qty < 1) return; // Prevent invalid or zero quantity
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

  /**
   * Handles changes to the discount input for a cart item.
   * @param {number} index - The index of the item in the cart.
   * @param {string} value - The new discount value from the input.
   */
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

  /**
   * Removes an item from the cart.
   * @param {number} index - The index of the item to remove.
   */
  const removeRow = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    calculateSubtotal(newCart);
  };

  /**
   * Submits the sale to the backend.
   */
  const handleSubmit = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated Background Elements */}

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 md:mb-6 bg-gradient-to-r from-white via-green-500 to-blue-200 bg-clip-text text-transparent animate-pulse">
            Sale Shoes
          </h1>
          <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        {/* Main Form Container */}
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl p-4 sm:p-6 md:p-8 mb-8">
          {/* Barcode Input Section */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-end">
              <div className="flex-grow group">
                <label className="block text-black/80 text-base md:text-lg font-semibold mb-2 md:mb-3 group-hover:text-black transition-colors">
                  Product Barcode
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Scan or enter barcode..."
                    onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
                    autoFocus
                    spellCheck={false}
                    className="w-full  bg-white/20 backdrop-blur-sm border border-black/30 rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-3 text-lg md:text-xl text-black placeholder-black/50
                      focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:border-purple-400 transition-all duration-300
                      hover:bg-white/25 hover:border-white/40"
                  />
                </div>
              </div>
              <button
                onClick={handleAddProduct}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-700 hover:from-purple-700 hover:via-purple-800 hover:to-blue-800
                  text-white font-bold text-lg md:text-xl px-6 py-2 md:px-10 md:py-3 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                type="button"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Adding...
                    </div>
                  ) : (
                    "Add Product"
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Cart Section: Responsive Table / Cards */}
          {cart.length > 0 && (
            <div className="mb-8 md:mb-12 transform transition-all duration-500 animate-fadeIn">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-white/20 backdrop-blur-xl bg-white/5">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
                    <thead className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm">
                      <tr className=" text-center">
                        {[
                          "SL",
                          "Product Name",
                          "Brand",
                          "Size",
                          "Price (৳)",
                          "Stock",
                          "Qty",
                          "Discount",
                          "Total",
                          "Action",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-5 text-lg font-bold text-white/90 border-b border-white/10"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, idx) => (
                        <tr
                          key={item.barcode}
                          className="group hover:bg-white/10 transition-all duration-300 border-b border-white/5 text-center"
                        >
                          <td className="px-6 py-4 text-lg font-bold text-purple-300">
                            {String(idx + 1).padStart(2, "0")}
                          </td>
                          <td className="px-6 py-4 text-lg text-black font-medium max-w-xs truncate">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-lg black/80">
                            {item.brand}
                          </td>
                          <td className="px-6 py-4 text-lg text-center">
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-lg font-semibold">
                              {item.size}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-lg text-center text-green-300 font-semibold">
                            {item.price.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-lg text-center">
                            <span
                              className={`px-3 py-1 rounded-lg font-semibold ${
                                item.quantity > 0
                                  ? "bg-green-600/10 text-green-500"
                                  : "bg-red-600/30 text-red-400"
                              }`}
                            >
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-6 py-3">
                            <input
                              type="number"
                              min="1"
                              max={item.quantity}
                              value={item.qty}
                              onChange={(e) =>
                                handleQtyChange(idx, e.target.value)
                              }
                              className="w-20 bg-white/20 backdrop-blur-sm border border-black/30 rounded-xl px-3 py-2 text-lg text-black font-semibold text-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-white/25"
                            />
                          </td>
                          <td className="px-6 py-3">
                            <input
                              type="number"
                              min="0"
                              max={item.price * item.qty}
                              value={item.discount}
                              onChange={(e) =>
                                handleDiscountChange(idx, e.target.value)
                              }
                              className="w-24 bg-white/20 backdrop-blur-sm border border-black/30 rounded-xl px-3 py-2 text-lg text-black font-semibold text-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all hover:bg-white/25"
                            />
                          </td>
                          <td className="px-6 py-4 text-lg font-black text-center">
                            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent text-xl">
                              {item.total.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              className="w-10 h-10 bg-red-600/20 hover:bg-red-600/40 rounded-xl text-red-400 hover:text-red-300 font-bold text-xl transition-all duration-300 hover:scale-110 hover:rotate-90 border border-red-500/30 hover:border-red-400/50"
                              onClick={() => removeRow(idx)}
                              aria-label="Remove item"
                            >
                              ×
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {cart.map((item, idx) => (
                  <div
                    key={item.barcode}
                    className="bg-white/10 border border-white/20 rounded-2xl p-4 flex flex-col gap-4 animate-slideInUp"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold ">{item.name}</h3>
                        <p className="text-sm ">{item.brand}</p>
                      </div>
                      <button
                        className="w-8 h-8 flex-shrink-0 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400 hover:text-red-300 font-bold text-xl transition-all duration-300"
                        onClick={() => removeRow(idx)}
                        aria-label="Remove item"
                      >
                        ×
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-4">
                      <div>
                        <label className="block text-xs text-white/60 uppercase">
                          Price
                        </label>
                        <p className="text-green-300 font-semibold">
                          ৳ {item.price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 uppercase">
                          Size
                        </label>
                        <p className="font-semibold text-white">{item.size}</p>
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 uppercase">
                          Stock
                        </label>
                        <p
                          className={`font-semibold ${
                            item.quantity > 10
                              ? "text-green-300"
                              : item.quantity > 5
                              ? "text-yellow-300"
                              : "text-red-300"
                          }`}
                        >
                          {item.quantity} available
                        </p>
                      </div>
                      <div>
                        <label className="block text-xs text-white/60 uppercase">
                          Total
                        </label>
                        <p className="font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent text-lg">
                          ৳ {item.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={item.quantity}
                          value={item.qty}
                          onChange={(e) => handleQtyChange(idx, e.target.value)}
                          className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white font-semibold text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Discount (৳)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={item.price * item.qty}
                          value={item.discount}
                          onChange={(e) =>
                            handleDiscountChange(idx, e.target.value)
                          }
                          className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white font-semibold text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary and Action Section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            <div className="text-center md:text-left">
              <p className="text-white/60 text-lg md:text-xl font-medium uppercase tracking-widest">
                Total Amount
              </p>
              <div className="text-4xl md:text-4xl font-black mt-2">
                <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  ৳ {subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || cart.length === 0}
              className="w-full md:w-auto bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700
                text-white md:px-8 md:py-3 py-2 px-4 rounded-2xl text-xl md:text-2xl font-bold shadow-2xl transition-all duration-300 transform hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group
                hover:shadow-green-500/25"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center gap-3">
                {isLoading && cart.length > 0 ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>🎫 Sale & Generate Invoice</>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom animations (no changes needed here) */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0; /* Start hidden for animation */
        }
      `}</style>
    </div>
  );
};

export default SellForm;
