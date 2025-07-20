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
import Signup from "../Pages/Login&SignUp/SignUp";
import Login from "../Pages/Login&SignUp/Login";




export const router = createBrowserRouter([
  {
    path: "/",
    element:<Dashboard/>,
    children: [
      // Define child routes here if needed
      {
        path: "/",
        element: <SellForm />,
      },
      {
        path:"stock-management",
        element: <StockManagement />,
      },
      {
        path:"barcodes",
        element: <BarcodePage/>,
      },
      {
        path:"add-shoes-item",
        element: <AddShoeForm />,
      },
      {
        path:"invoice/:saleId",
        element: <InvoicePage/>,
      },
      {
        path:"sell-history",
        element: <SellHistory/>
      },
      {
        path:"/sale/:saleId",
        element: <UpdateSaleItem/>
      },
      {
        path:"/update-shoe/:id",
        element: <UpdateStockShoes/>
      },
      {
        path:"/signUp",
        element: <Signup/>
      },
      {
        path:"/login",
        element: <Login/>
      },
    ],
  },
]);