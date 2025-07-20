import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateStockShoes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateData, setUpdateData] = useState(null);

  useEffect(() => {
    axios
      .get(`https://shoes-pos-server.vercel.app/api/shoes/${id}`)
      .then((res) => setUpdateData(res.data))
      .catch((err) => {
        console.error("Failed to fetch shoe:", err);
        alert("Failed to load shoe data");
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedShoe = {
      shoeName: form.shoeName.value,
      brand: form.brand.value,
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
      navigate("/stock-management");
      console.log(res);
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed");
    }
  };

  if (!updateData) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Update Shoe</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        {[
          "shoeName",
          "brand",
          "articleNumber",
          "color",
          "size",
          "quantity",
          "pricePerPair",
        ].map((field) => (
          <div key={field}>
            <label className="block mb-1 font-semibold capitalize">
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
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateStockShoes;
