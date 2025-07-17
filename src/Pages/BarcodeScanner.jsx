import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const BarcodeScanner = ({ onScanSuccess, onClose }) => {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (!isRunningRef.current) return;

          // ✅ Clean up barcode
          const cleanedBarcode = decodedText.trim().replace(/\s+/g, "");

          // ✅ Optional: Reject invalid barcodes
          const isValid = /^[a-zA-Z0-9\-]+$/.test(cleanedBarcode);
          if (!isValid) {
            alert("Invalid barcode format scanned.");
            return;
          }

          isRunningRef.current = false;
          onScanSuccess(cleanedBarcode);

          scanner.stop().then(() => {
            document.getElementById("reader").innerHTML = "";
          });
        }
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((err) => {
        console.error("Scanner failed to start", err);
        alert("⚠️ Camera access failed. Please allow permission.");
        onClose();
      });

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        scannerRef.current.stop().then(() => {
          document.getElementById("reader").innerHTML = "";
          isRunningRef.current = false;
        });
      }
    };
  }, [onScanSuccess, onClose]);

  const handleCancel = () => {
    if (scannerRef.current && isRunningRef.current) {
      scannerRef.current.stop().then(() => {
        document.getElementById("reader").innerHTML = "";
        isRunningRef.current = false;
        onClose();
      });
    } else {
      onClose();
    }
  };

  return (
    <div className="p-4">
      <div id="reader" className="w-full h-[300px] bg-gray-100" />
      <button
        onClick={handleCancel}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Cancel Scan
      </button>
    </div>
  );
};

export default BarcodeScanner;
