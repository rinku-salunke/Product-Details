import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./Includes/Header";
import Products from "./Components/Products";
import ProductDetail from "./Components/ProductDetail";
import Categories from "./Components/Categories";
import CategoryList from "./Components/CategoryList";
import CategoryProducts from "./Components/CategoryProducts";
import AddProduct from "./Pages/AddProduct";
import DeleteProduct from "./Pages/DeleteProduct";
import UpdateProduct from "./Pages/UpdateProduct";
import UpdateProductList from "./Components/UpdateProductList";
import Cart from "./Components/Cart";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="add-product" element={<AddProduct />}></Route>
        <Route path="/update-product" element={<UpdateProductList />} />
        <Route path="/update-product/:id" element={<UpdateProduct />} />
        <Route path="delete-product" element={<DeleteProduct />}></Route>
        <Route path="/categoriesList" element={<CategoryList />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
        <Route path="/category/:slug" element={<CategoryProducts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
