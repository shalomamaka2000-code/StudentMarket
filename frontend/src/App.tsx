import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/LogIn';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import TrackOrder from './pages/TrackOrder';
import MyOrders from './pages/MyOrders';
import './App.css';
import RoleRoute from './components/RoleRoute';
import VendorDashboard from './pages/VendorDashboard';
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="app">
            <Navbar />
            <main className="main-content">
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/products" element={<Products />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
  <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
  <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
  <Route path="/track/:trackingId" element={<TrackOrder />} />
  <Route path="/chat/:peerId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
  <Route path="/vendor" element={<RoleRoute roles={['vendor']}><VendorDashboard /></RoleRoute>} />
  <Route path="/admin" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
  <Route path="/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
</Routes>
            </main>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#FDF6E3',
                  color: '#5C4033',
                  border: '1px solid #E8D5B7',
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;