import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const ShoeAddForm = () => {
   const navigate = useNavigate(); // ✅ for redirection

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
      const res = await axios.post(`http://localhost:5000/api/shoes/add`, payload);

      Swal.fire({
        icon: "success",
        title: "Added Successfully",
        text: `Inserted: ${res.data.insertedCount}, Updated: ${res.data.updatedCount}`,
      });

      resetForm();

      // ✅ Redirect to /barcodes with added barcodes
      navigate("/barcodes", { state: { barcodes: res.data.addedShoes } });

    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Error adding shoes" });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Shoe Stock</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="shoeName"
          onChange={handleChange}
          value={formData.shoeName}
          className="w-full border p-2"
          placeholder="Shoe Name"
          required
        />
        <input
          name="brand"
          onChange={handleChange}
          value={formData.brand}
          className="w-full border p-2"
          placeholder="Brand"
          required
        />
        <input
          name="articleNumber"
          onChange={handleChange}
          value={formData.articleNumber}
          className="w-full border p-2"
          placeholder="Article Number (optional)"
        />
        <input
          name="color"
          onChange={handleChange}
          value={formData.color}
          className="w-full border p-2"
          placeholder="Color"
          required
        />
        <input
          name="pricePerPair"
          type="number"
          onChange={handleChange}
          value={formData.pricePerPair}
          className="w-full border p-2"
          placeholder="Price Per Pair"
          required
        />

        <div>
          <h3 className="font-semibold">Quantities Per Size</h3>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[6, 7, 8, 9, 10, 11].map((size) => (
              <div key={size} className="flex flex-col">
                <label>Size {size}</label>
                <input
                  name={`size${size}`}
                  type="number"
                  min="0"
                  value={formData.quantitiesPerSize[size]}
                  onChange={handleChange}
                  className="border p-1"
                  placeholder="Qty"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Shoe
        </button>
      </form>
    </div>
  );
};

export default ShoeAddForm;
