import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import BookDetail from "../pages/BookDetail";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";

import ProtectedAdminRoute from "../components/admin/ProtectedAdminRoute";
import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserLayout from "../components/layout/UserLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminBooks from "../pages/admin/books/AdminBooks";
import AddBook from "../pages/admin/books/AddBook";
import EditBook from "../pages/admin/books/EditBook";

import CategoryList from "../pages/admin/categories/CategoryList";
import AddCategory from "../pages/admin/categories/AddCategory";
import EditCategory from "../pages/admin/categories/EditCategory";

import AuthorList from "../pages/admin/authors/AuthorList";
import AddAuthor  from "../pages/admin/authors/AddAuthor";
import EditAuthor from "../pages/admin/authors/EditAuthor";

import OrderList from "../pages/admin/order/OrderList";
import OrderDetail from "../pages/admin/order/OrderDetail";

import UserList from "../pages/admin/user/UserList";
import UserDetail from "../pages/admin/user/UserDetail";
import EditUser from "../pages/admin/user/EditUser";

function AppRouter() {
  return (
    <Routes>
      {/* Auth Routes (Không dùng chung Layout của Client/Admin) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= USER (CLIENT WITH LAYOUT) ================= */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />

        <Route
          path="/books/:id"
          element={<BookDetail />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />
      </Route>

      {/* ================= ADMIN (WITH LAYOUT & PROTECTED) ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        {/* DASHBOARD */}
        <Route index element={<AdminDashboard />} />

        {/* BOOKS */}
        <Route path="books" element={<AdminBooks />} />
        <Route path="books/add" element={<AddBook />} />
        <Route path="books/edit/:id" element={<EditBook />} />

        {/* CATEGORIES */}
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/add" element={<AddCategory />} />
        <Route path="categories/edit/:id" element={<EditCategory />} />

        {/* AUTHORS */}
        <Route path="authors" element={<AuthorList />} />
        <Route path="authors/add" element={<AddAuthor />} />
        <Route path="authors/edit/:id" element={<EditAuthor />} />

        {/* ORDERS */}
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetail />} />

        {/* USERS */}
        <Route path="users" element={<UserList />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="users/edit/:id" element={<EditUser />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;