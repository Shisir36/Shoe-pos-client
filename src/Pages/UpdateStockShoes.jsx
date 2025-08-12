import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateStockShoes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateData, setUpdateData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch the shoe data when the component mounts
  useEffect(() => {
    axios
      .get(`https://shoes-pos-server.vercel.app/api/shoes/${id}`)
      .then((res) => {
        setUpdateData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch shoe:", err);
        setError("Failed to load shoe data. Please try again later.");
        setIsLoading(false);
      });
  }, [id]);

  // Handle the form submission to update the shoe
  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    // Construct the updated shoe object from form values
    const updatedShoe = {
      shoeName: form.shoeName.value,
      brand: form.brand.value,
      category: form.category.value, // Added category field
      articleNumber: form.articleNumber.value,
      color: form.color.value,
      size: Number(form.size.value),
      quantity: Number(form.quantity.value),
      pricePerPair: Number(form.pricePerPair.value),
    };

    try {
      const res = await axios.put(
        `https://shoes-pos-server.vercel.app/api/shoes/${id}`,
        updatedShoe
      );
      alert("Shoe updated successfully!");
      navigate("/stock-management"); // Navigate back to the stock list
      console.log(res);
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed. Please check the console for details.");
    }
  };

  // Display loading or error states
  if (isLoading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-lg text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-slate-800">
        Update Shoe Details
      </h2>
      <form onSubmit={handleUpdate} className="space-y-6">
        {[
          "shoeName",
          "brand",
          "category", // Added category to the fields array
          "articleNumber",
          "color",
          "size",
          "quantity",
          "pricePerPair",
        ].map((field) => (
          <div key={field}>
            <label className="block mb-2 font-semibold capitalize text-slate-700">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={
                ["size", "quantity", "pricePerPair"].includes(field)
                  ? "number"
                  : "text"
              }
              name={field}
              defaultValue={updateData[field]}
              className="w-full border border-slate-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold text-lg transition-transform transform hover:scale-105"
        >
          Update Shoe
        </button>
      </form>
    </div>
  );
};

export default UpdateStockShoes;
