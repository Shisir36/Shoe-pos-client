import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ShoeAddForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shoeName: "",
    brand: "",
    articleNumber: "",
    color: "",
    pricePerPair: "",
    quantitiesPerSize: {
      6: "",
      7: "",
      8: "",
      9: "",
      10: "",
      11: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("size")) {
      const size = name.split("size")[1];
      setFormData((prev) => ({
        ...prev,
        quantitiesPerSize: {
          ...prev.quantitiesPerSize,
          [size]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      shoeName: "",
      brand: "",
      articleNumber: "",
      color: "",
      pricePerPair: "",
      quantitiesPerSize: {
        6: "",
        7: "",
        8: "",
        9: "",
        10: "",
        11: "",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedQuantities = {};
    Object.entries(formData.quantitiesPerSize).forEach(([size, qty]) => {
      if (qty && !isNaN(qty) && Number(qty) > 0) {
        cleanedQuantities[size] = Number(qty);
      }
    });

    const payload = {
      ...formData,
      pricePerPair: Number(formData.pricePerPair),
      quantitiesPerSize: cleanedQuantities,
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
        confirmButtonColor: "#22c55e", // green
      });

      resetForm();

      navigate("/barcodes", { state: { barcodes: res.data.addedShoes } });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Error adding shoes" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
        Add New Shoe Stock
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <input
            name="shoeName"
            onChange={handleChange}
            value={formData.shoeName}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Shoe Name"
            required
          />
          <input
            name="brand"
            onChange={handleChange}
            value={formData.brand}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Brand"
            required
          />
          <input
            name="articleNumber"
            onChange={handleChange}
            value={formData.articleNumber}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Article Number (optional)"
          />
          <input
            name="color"
            onChange={handleChange}
            value={formData.color}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Color"
            required
          />
          <input
            name="pricePerPair"
            type="number"
            onChange={handleChange}
            value={formData.pricePerPair}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Price Per Pair"
            required
          />
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Quantities Per Size
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[6, 7, 8, 9, 10, 11].map((size) => (
              <div key={size} className="flex flex-col">
                <label className="text-sm text-gray-600">Size {size}</label>
                <input
                  name={`size${size}`}
                  type="number"
                  min="0"
                  value={formData.quantitiesPerSize[size]}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Qty"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded shadow-md transition-all"
          >
            Add Shoe
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShoeAddForm;
