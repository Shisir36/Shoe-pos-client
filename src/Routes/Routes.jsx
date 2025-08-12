import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../Pages/DefaultPage/Dashborad";
import AddShoeForm from "../Pages/AddShoeForm";
import StockManagement from "../Pages/StockManagement";
import BarcodePage from "../Pages/BarcodePage";
import SellForm from "../Pages/SellForm";
import InvoicePage from "../Pages/InvoicePage";
import SellHistory from "../Pages/SellHistory";
import UpdateSaleItem from "../Pages/UpdateSaleItem";
import UpdateStockShoes from "../Pages/UpdateStockShoes";
import Login from "../Pages/Login&SignUp/Login";
import Signup from "../Pages/Login&SignUp/SignUp";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  // --- Public Routes ---
  // Login and Signup are accessible to everyone.
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup/>,
  },

  // --- Protected Dashboard Routes ---
  // The PrivateRoute component wraps the Dashboard.
  // Only authenticated admins can access the Dashboard and its children.
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    // All these children are now protected by the PrivateRoute above.
    children: [
      {
        index: true, // This makes SellForm the default page for the "/" path
        element: <SellForm />,
      },
      {
        path: "stock-management",
        element: <StockManagement />,
      },
      {
        path: "barcodes",
        element: <BarcodePage />,
      },
      {
        path: "add-shoes-item",
        element: <AddShoeForm />,
      },
      {
        path: "invoice/:saleId",
        element: <InvoicePage />,
      },
      {
        path: "sell-history",
        element: <SellHistory />,
      },
      {
        // Note: Child paths should not start with a "/"
        path: "sale/:saleId",
        element: <UpdateSaleItem />,
      },
      {
        path: "update-shoe/:id",
        element: <UpdateStockShoes />,
      },
    ],
  },
]);
