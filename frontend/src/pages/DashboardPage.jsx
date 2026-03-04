import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, token, logout, login } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('orders'); 
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit States
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setEditName(user.name);
    setEditPhone(user.phone || '');

    const fetchOrders = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/my-orders`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, token, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateMessage({ type: '', text: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editName, phone: editPhone })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      login(data.user, token);
      setUpdateMessage({ type: 'success', text: 'Your details have been saved successfully.' });
    } catch (err) {
      setUpdateMessage({ type: 'error', text: err.message || 'Error updating details.' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateTestOrder = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/debug/create-test-order`, { 
        method: 'POST', 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      
      if (response.ok) {
        window.location.reload(); 
      } else {
        const errorData = await response.json();
        alert("Server error: " + errorData.error);
      }
    } catch (error) { 
      console.error("Error generating test order:", error); 
      alert("Failed to communicate with the server.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-32 px-6 md:px-16 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Profile Sidebar */}
        <aside className="w-full lg:w-1/4">
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 shadow-sm transition-colors rounded-sm">
            <div className="w-16 h-16 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full flex items-center justify-center font-syne font-bold text-2xl mb-6">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2 className="font-syne text-xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-8">{user.email}</p>
            
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => setActiveTab('orders')} 
                className={`text-left text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'orders' ? 'text-baza-lavender dark:text-baza-mint' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                My Orders
              </button>
              <button 
                onClick={() => setActiveTab('profile')} 
                className={`text-left text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'profile' ? 'text-baza-lavender dark:text-baza-mint' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
              >
                Personal Details
              </button>
              
              {/* NOVA OPÇÃO DE RASTREIO AQUI! */}
              <Link 
                to="/rastreio" 
                className="text-left text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Track Order
              </Link>

              <button onClick={handleLogout} className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors pt-4 border-t border-gray-100 dark:border-gray-700">
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4">
          
          {/* TAB: MY ORDERS */}
          {activeTab === 'orders' && (
            <div className="animate-in fade-in duration-500">
              <h1 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-8">My Orders</h1>
              
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-baza-lavender dark:border-t-baza-mint rounded-full animate-spin"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-12 text-center transition-colors">
                  <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't placed any orders yet.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/shop" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint hover:text-white transition-all shadow-md inline-block">
                      Explore Collection
                    </Link>
                    <button 
                      onClick={handleCreateTestOrder}
                      className="border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Generate Demo Order
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-6 sm:p-8 shadow-sm transition-colors rounded-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">Order #{order.id.slice(0, 8).toUpperCase()}</span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </div>
                        <div className="mt-4 sm:mt-0 text-right">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">Total USD</span>
                          <span className="font-mono font-bold text-gray-900 dark:text-white text-lg">${order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-sm overflow-hidden flex-shrink-0">
                              <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                            </div>
                            <div>
                              <p className="font-syne font-bold text-sm text-gray-900 dark:text-white">{item.product?.name}</p>
                              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-1">Qty: {item.quantity} | ${item.price.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tracking Section */}
                      {order.trackingCode ? (
                        <div className="mt-8 bg-baza-mint/5 dark:bg-baza-mint/10 border border-baza-mint/20 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-widest text-baza-mint block mb-1">Tracking Number</span>
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{order.trackingCode}</span>
                          </div>
                          <Link to="/rastreio" className="w-full sm:w-auto text-center text-[10px] font-bold uppercase tracking-widest bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 hover:bg-baza-lavender dark:hover:bg-baza-mint transition-colors">
                            Track Order
                          </Link>
                        </div>
                      ) : (
                        <div className="mt-8 pt-6 border-t border-gray-50 dark:border-gray-800">
                          <p className="text-[10px] text-gray-400 italic font-medium uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></span>
                            📦 Awaiting fulfillment...
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PERSONAL DETAILS */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-500">
              <h1 className="font-syne text-3xl font-bold text-gray-900 dark:text-white mb-8">Personal Information</h1>
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-8 shadow-sm transition-colors rounded-sm">
                
                {updateMessage.text && (
                  <div className={`p-4 mb-6 border-l-4 ${updateMessage.type === 'success' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-red-50 border-red-500 text-red-700'}`}>
                    <p className="text-sm font-medium">{updateMessage.text}</p>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">Email Address</label>
                    <input type="email" disabled value={user.email} className="w-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-500 cursor-not-allowed" />
                    <p className="text-[10px] text-gray-400 mt-1">Email cannot be changed for security reasons.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)} 
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-900 dark:text-gray-300 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={editPhone} 
                      onChange={(e) => setEditPhone(e.target.value)} 
                      placeholder="+1 (555) 000-0000" 
                      className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white outline-none focus:border-baza-lavender transition-colors" 
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isUpdating} 
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-baza-lavender dark:hover:bg-baza-mint dark:hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center min-w-[200px]"
                  >
                    {isUpdating ? (
                      <div className="w-4 h-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}