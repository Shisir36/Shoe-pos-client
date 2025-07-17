import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";

const BarcodePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const barcodes = location.state?.barcodes;

  useEffect(() => {
    if (!barcodes || barcodes.length === 0) {
      navigate("/");
      return;
    }

    barcodes.forEach((shoe, index) => {
      try {
        JsBarcode(`#barcode-${index}`, shoe.barcode, {
          format: "CODE128",
          width: 1.8,
          height: 100,
          fontSize: 14,
          displayValue: true,
          margin: 0,
        });
      } catch (error) {
        console.error(`Barcode generation failed for index ${index}`, error);
      }
    });
  }, [barcodes, navigate]);

  if (!barcodes || barcodes.length === 0) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-area, .print-area * {
              visibility: visible;
            }
            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            button {
              display: none !important;
            }
          }
        `}
      </style>

      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Newly Generated Barcodes</h2>

        <button
          onClick={handlePrint}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Print Barcodes
        </button>

        <div className="print-area grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {barcodes.map((shoe, index) => (
            <div
              key={index}
              className="border p-3 rounded shadow bg-white flex flex-col items-center h-[100px]"
            >
              <h4 className="text-sm text-center mb-2">
                {shoe.brand} - {shoe.articleNumber || "NA"} - Size {shoe.size}
              </h4>
              <svg
                id={`barcode-${index}`}
                className="w-full h-auto"
                style={{ maxWidth: "200px" }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BarcodePage;
