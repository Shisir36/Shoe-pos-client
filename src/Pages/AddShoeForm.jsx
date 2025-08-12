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
    color: "",
    pricePerPair: "",
  });

  const [customSizes, setCustomSizes] = useState([{ size: "", quantity: "" }]);

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
    setCustomSizes([...customSizes, { size: "", quantity: "" }]);
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
      color: "",
      pricePerPair: "",
    });
    setCustomSizes([{ size: "", quantity: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare quantitiesPerSize object from customSizes
    const quantitiesPerSize = {};
    customSizes.forEach(({ size, quantity }) => {
      if (size && quantity && !isNaN(quantity)) {
        quantitiesPerSize[size] = Number(quantity);
      }
    });

    if (Object.keys(quantitiesPerSize).length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please add at least one size and quantity",
      });
      return;
    }

    const payload = {
      ...formData,
      pricePerPair: Number(formData.pricePerPair),
      quantitiesPerSize,
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
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
        Add New Shoe Stock{" "}
        <GiRunningShoe className="inline-block w-8 h-8 ml-2 text-green-600" />
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            name="color"
            onChange={handleFormChange}
            value={formData.color}
            className="w-full border p-2 rounded focus:ring-green-400"
            placeholder="Color"
            required
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

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mt-4 mb-2">
            Custom Sizes & Quantities
          </h3>

          {customSizes.map((row, idx) => (
            <div key={idx} className="flex gap-3 mb-2">
              <input
                type="text"
                name="size"
                value={row.size}
                onChange={(e) => handleCustomChange(idx, e)}
                placeholder="Size "
                className="w-1/2 border p-2 rounded"
                required
              />
              <input
                type="number"
                name="quantity"
                value={row.quantity}
                onChange={(e) => handleCustomChange(idx, e)}
                placeholder="Quantity"
                className="w-1/2 border p-2 rounded"
                min="0"
                required
              />
              {customSizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCustomSize(idx)}
                  className="text-red-600"
                >
                  ❌
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addCustomSize}
            className="text-blue-600 mt-2"
          >
            + Add More Sizes
          </button>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded shadow-md"
          >
            Add Shoe
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShoeAddForm;
