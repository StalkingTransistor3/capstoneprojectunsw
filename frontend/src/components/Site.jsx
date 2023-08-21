import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import CustomerHome from '../pages/CustomerHome.jsx';
import CustomerMenu from '../pages/CustomerMenu.jsx';
import CustomerCart from '../pages/CustomerCart.jsx';
import CustomerWelcome from '../pages/CustomerWelcome.jsx';
import Login from '../components/Login.jsx';
import DashboardKitchen from '../components/DashboardKitchen.jsx';
import DashboardManager from '../components/DashboardManager.jsx';
import DashboardWaitStaff from '../components/DashboardWaitStaff.jsx';
import WaitStaffTable from '../components/WaitStaff/table.jsx';
import WaitStaffSupport from '../components/WaitStaff/support.jsx';
import WaitStaffOrders from '../components/WaitStaff/orders.jsx';
import WaitStaffFoodSupport from '../components/WaitStaff/foodSupport.jsx';
import WaitStaffFoodOrder from '../components/WaitStaff/foodOrder.jsx';
import WaitStaffFoodDashboard from '../components/WaitStaff/foodDashboard.jsx';
import WaitStaffPendingPayments from '../components/WaitStaff/pendingPayments.jsx';
import WaitStaffFoodPayments from '../components/WaitStaff/foodPayments.jsx';
import ResetPassword from '../components/ResetPassword.jsx';

import CartProvider from './../contexts/CartProvider';
import Map from './Map.jsx';
export default function Site() {
  return (
    <>
      <CartProvider>
        <Routes>
          <Route path="/" element={<CustomerWelcome />} />
          <Route path="/CustomerHome" element={<CustomerHome />} />
          <Route path="/CustomerMenu" element={<CustomerMenu />} />
          <Route path="/CustomerMap" element={<Map manage={false} />} />
          <Route path="CustomerCart" element={<CustomerCart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboardmanager" element={<DashboardManager />} />
          {/* Dashboard WaitStaff */}
          <Route path="/dashboardwait" element={<DashboardWaitStaff />} />
          <Route path="/dashboardwait/table" element={<WaitStaffTable />} />
          <Route path="/dashboardwait/support" element={<WaitStaffSupport />} />
          <Route path="/dashboardwait/orders" element={<WaitStaffOrders />} />
          <Route
            path="/dashboardwait/foodSupport"
            element={<WaitStaffFoodSupport />}
          />
          <Route
            path="/dashboardwait/foodOrder"
            element={<WaitStaffFoodOrder />}
          />
          <Route
            path="/dashboardwait/foodDashboard"
            element={<WaitStaffFoodDashboard />}
          />
          <Route
            path="/dashboardwait/pendingPayments"
            element={<WaitStaffPendingPayments />}
          />
          <Route
            path="/dashboardwait/foodPayments"
            element={<WaitStaffFoodPayments />}
          />
          {/* Dashboard Kitchen */}
          <Route path="/dashboardkitchen" element={<DashboardKitchen />} />
        </Routes>
      </CartProvider>
    </>
  );
}
