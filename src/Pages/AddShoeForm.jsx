import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { GiRunningShoe } from "react-icons/gi";

const ShoeAddForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: "",
    shoeName: "",
    brand: "",
    articleNumber: "",
    pricePerPair: "",
  });

  const [customSizes, setCustomSizes] = useState([
    { size: "", quantity: "", color: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...customSizes];
    updated[index][name] = value;
    setCustomSizes(updated);
  };

  const addCustomSize = () => {
    setCustomSizes([...customSizes, { size: "", quantity: "", color: "" }]);
  };

  const removeCustomSize = (index) => {
    const updated = [...customSizes];
    updated.splice(index, 1);
    setCustomSizes(updated);
  };

  const resetForm = () => {
    setFormData({
      category: "",
      shoeName: "",
      brand: "",
      articleNumber: "",
      pricePerPair: "",
    });
    setCustomSizes([{ size: "", quantity: "", color: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const inventory = customSizes
      .filter((item) => item.size && item.quantity && item.color)
      .map((item) => ({
        ...item,
        quantity: Number(item.quantity),
      }));

    if (inventory.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please add at least one complete entry with size, quantity, and color.",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      pricePerPair: Number(formData.pricePerPair),
      inventory,
    };

    try {
      const res = await axios.post(
        `https://shoes-pos-server.vercel.app/api/shoes/add`,
        payload
      );

      Swal.fire({
        icon: "success",
        title: "Added Successfully",
        text: `Inserted: ${res.data.insertedCount}, Updated: ${res.data.updatedCount}`,
        confirmButtonColor: "#22c55e",
      });

      resetForm();
      navigate("/barcodes", { state: { barcodes: res.data.addedShoes } });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Error adding shoes" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-8">
        Add New Shoe Stock{" "}
        <GiRunningShoe className="inline-block w-8 h-8 ml-2 text-green-600" />
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* <-- দুই-কলামের Grid লেআউট সরিয়ে দেওয়া হয়েছে --> */}

        {/* Section 1: Main Shoe Details */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Shoe Details
          </h3>
          <div className="space-y-3">
            <select
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">Select Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids-Boys">Kids-Boys</option>
              <option value="Kids-Girls">Kids-Girls</option>
              <option value="Baby">Baby</option>
            </select>
            <input
              name="shoeName"
              onChange={handleFormChange}
              value={formData.shoeName}
              className="w-full border p-2 rounded focus:ring-green-400"
              placeholder="Shoe Name"
              required
            />
            <input
              name="brand"
              onChange={handleFormChange}
              value={formData.brand}
              className="w-full border p-2 rounded focus:ring-green-400"
              placeholder="Brand"
              required
            />
            <input
              name="articleNumber"
              onChange={handleFormChange}
              value={formData.articleNumber}
              className="w-full border p-2 rounded focus:ring-green-400"
              placeholder="Article Number"
            />
            <input
              name="pricePerPair"
              type="number"
              onChange={handleFormChange}
              value={formData.pricePerPair}
              className="w-full border p-2 rounded focus:ring-green-400"
              placeholder="Price Per Pair"
              required
            />
          </div>
        </div>

        {/* Section 2: Sizes, Quantities, and Colors (Shoe details এর নিচে) */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Inventory by Size & Color
          </h3>
          <div>
            {customSizes.map((row, idx) => (
              // <-- ইনপুট ফিল্ডগুলো আবার পাশাপাশি (side-by-side) করা হয়েছে -->
              <div key={idx} className="flex items-center gap-3 mb-2">
                <input
                  type="text"
                  name="size"
                  value={row.size}
                  onChange={(e) => handleCustomChange(idx, e)}
                  placeholder="Size"
                  className="flex-1 border p-2 rounded"
                  required
                />
                <input
                  type="number"
                  name="quantity"
                  value={row.quantity}
                  onChange={(e) => handleCustomChange(idx, e)}
                  placeholder="Quantity"
                  className="flex-1 border p-2 rounded"
                  min="0"
                  required
                  onWheel={(e) => e.target.blur()} // scroll disable
                />

                <input
                  type="text"
                  name="color"
                  value={row.color}
                  onChange={(e) => handleCustomChange(idx, e)}
                  placeholder="Color"
                  className="flex-1 border p-2 rounded"
                  required
                />
                {customSizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCustomSize(idx)}
                    className="text-red-500 hover:text-red-700 font-bold"
                    title="Remove Row"
                  >
                    &#10005;
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addCustomSize}
            className="text-blue-600 hover:text-blue-800 font-semibold"
          >
            + Add More
          </button>
        </div>

        <div className="text-center pt-4 border-t mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isSubmitting ? "Adding Shoe..." : "Add Shoe"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShoeAddForm;
