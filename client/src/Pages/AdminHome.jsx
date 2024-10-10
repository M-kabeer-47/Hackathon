

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronDown, LogOut, Menu, UserCircle, X, BarChart, Package, DollarSign, Star, Eye } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayText}</span>;
};

const UserRequestCard = ({ request, onStatusChange, onPriceAdjust, onViewDetails }) => {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6">
        <motion.button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(request);
          }}
        >
          <Eye className="h-5 w-5" />
        </motion.button>
        <h2 className="text-xl font-semibold text-blue-600 mb-2">{request.name}</h2>
        <div className="flex items-center mb-4">
          <Package className="h-5 w-5 text-blue-500 mr-2" />
          <p className="text-sm text-gray-600">
            {request.device.brand} {request.device.model}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Condition</p>
            <p className="text-sm font-medium text-gray-800">{request.condition}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Storage</p>
            <p className="text-sm font-medium text-gray-800">{request.device.storage}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Estimated Price</p>
            <p className="text-sm font-medium text-gray-800">${request.estimatedPrice}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <p className={`text-sm font-medium ${
              request.verificationStatus === 'Pending' ? 'text-yellow-600' :
              request.verificationStatus === 'Approved' ? 'text-green-600' :
              request.verificationStatus === 'Rejected' ? 'text-red-600' :
              'text-blue-600'
            }`}>
              {request.verificationStatus}
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
            onClick={() => onStatusChange(request.id, 'Approved')}
          >
            Approve
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
            onClick={() => onPriceAdjust(request)}
          >
            Adjust Price
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600"
            onClick={() => onStatusChange(request.id, 'Rejected')}
          >
            Reject
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const FullScreenPopup = ({ children, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
};

const AdminHome = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('User Requests');
  const [isDesktop, setIsDesktop] = useState(false);
  const [userRequests, setUserRequests] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      device: { brand: 'Apple', model: 'iPhone 12', storage: '128GB' },
      condition: 'Used',
      estimatedPrice: 480,
      verificationStatus: 'Pending',
      serialNumber: 'IMEI123456789',
      defects: ['Minor scratches', 'Battery at 85%'],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543',
      device: { brand: 'Samsung', model: 'Galaxy S21', storage: '256GB' },
      condition: 'New',
      estimatedPrice: 590,
      verificationStatus: 'Pending',
      serialNumber: 'IMEI987654321',
      defects: [],
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      phone: '+1 (555) 246-8135',
      device: { brand: 'Google', model: 'Pixel 5', storage: '128GB' },
      condition: 'Damaged',
      estimatedPrice: 350,
      verificationStatus: 'Pending',
      serialNumber: 'IMEI135792468',
      defects: ['Cracked screen', 'Non-functional camera'],
    },
  ]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isAdjustingPrice, setIsAdjustingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setUserRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === id ? { ...request, verificationStatus: newStatus } : request
      )
    );
  };

  const handlePriceAdjust = (request) => {
    setNewPrice(request.estimatedPrice);
    setIsAdjustingPrice(true);
    setSelectedRequest(request);
  };

  const confirmPriceAdjustment = () => {
    setUserRequests(prevRequests =>
      prevRequests.map(request =>
        request.id === selectedRequest.id ? {
          ...request,
          estimatedPrice: newPrice,
          verificationStatus: 'Pending Approval from User'
        } : request
      )
    );
    setIsAdjustingPrice(false);
    setSelectedRequest(null);
  };

  const handleViewDetails = (request) => {
    if (!isAdjustingPrice) {
      setSelectedRequest(request);
    }
  };

  const averageDeviceConditionData = {
    labels: ['New', 'Used', 'Damaged'],
    datasets: [
      {
        label: 'Sales',
        data: [1200, 800, 400],
        backgroundColor: ['rgba(34, 197, 94, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(239, 68, 68, 0.6)'],
        borderColor: ['rgb(34, 197, 94)', 'rgb(59, 130, 246)', 'rgb(239, 68, 68)'],
        borderWidth: 1,
      },
    ],
  };

  const devicesSoldData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Devices Sold',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Device Condition Trends',
        color: '#6b7280',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6b7280',
        },
      },
      x: {
        ticks: {
          color: '#6b7280',
        },
      },
    },
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || isDesktop) && (
          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:relative"
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <motion.h2 
                  className="text-xl font-bold text-blue-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <button src='/admin'><span className="mr-2">📱</span>BuyBack</button>
                </motion.h2>
                <button onClick={toggleSidebar} className="lg:hidden text-gray-600 hover:text-gray-800">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                {['User Requests', 'Analytics Dashboard'].map((tab, index) => (
                  <motion.button
                    key={tab}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center w-full px-4 py-3 text-left ${
                      activeTab === tab ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {tab === 'User Requests' && <UserCircle className="mr-3 h-5 w-5" />}
                    {tab === 'Analytics Dashboard' && <BarChart className="mr-3 h-5 w-5" />}
                    {tab}
                  </motion.button>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center w-full px-4 py-2 text-red-600 rounded-md hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <motion.button 
                onClick={toggleSidebar} 
                className={isDesktop ? 'hidden' : 'block mr-4'}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Menu className="h-6 w-6 text-gray-600 hover:text-gray-800" />
              </motion.button>
              <h1 className="text-xl font-bold text-blue-600">
                <TypewriterText text="Welcome to Admin Panel!" />
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button 
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
              </motion.button>
              <motion.div 
                className="flex items-center space-x-2 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="Admin Avatar"
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Admin User</span>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </motion.div>
            </div>
          </div>
        </header>

        {/* Main dashboard */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <motion.h1 
            className="text-3xl font-bold text-blue-600 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {activeTab}
          </motion.h1>

          <AnimatePresence mode="wait">
            {activeTab === 'User Requests' && (
              <motion.div
                key="user-requests"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInUp}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRequests.map((request) => (
                    <UserRequestCard
                      key={request.id}
                      request={request}
                      onStatusChange={handleStatusChange}
                      onPriceAdjust={handlePriceAdjust}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </motion.div>
            )}
            {activeTab === 'Analytics Dashboard' && (
              <motion.div
                key="analytics"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeInUp}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Average Device Condition Trends</h3>
                  <div className="w-full h-64">
                    <Bar data={averageDeviceConditionData} options={chartOptions} />
                  </div>
                </motion.div>
                <motion.div
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Number of Devices Sold</h3>
                  <div className="w-full h-64">
                    <Line data={devicesSoldData} options={chartOptions} />
                  </div>
                </motion.div>
                <motion.div
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Request Status</h3>
                  <div className="space-y-4">
                    <div className="relative pl-4 border-l-2 border-yellow-500">
                      <h4 className="font-medium text-yellow-600">Pending</h4>
                      <p className="text-sm text-gray-600">Average time: 2 days</p>
                      <p className="text-sm text-gray-600">Total requests: 15</p>
                    </div>
                    <div className="relative pl-4 border-l-2 border-green-500">
                      <h4 className="font-medium text-green-600">Verified</h4>
                      <p className="text-sm text-gray-600">Average time: 5 days</p>
                      <p className="text-sm text-gray-600">Total requests: 42</p>
                    </div>
                    <div className="relative pl-4 border-l-2 border-red-500">
                      <h4 className="font-medium text-red-600">Rejected</h4>
                      <p className="text-sm text-gray-600">Average time: 1 day</p>
                      <p className="text-sm text-gray-600">Total requests: 7</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Financial Reports</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-blue-600">$125,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending Payments</p>
                      <p className="text-2xl font-bold text-yellow-600">$15,000</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Recent Transactions</p>
                      <ul className="mt-2 space-y-2">
                        <li className="text-sm text-gray-600">
                          <span className="font-medium text-blue-600">$500</span> - iPhone 12 (2 days ago)
                        </li>
                        <li className="text-sm text-gray-600">
                          <span className="font-medium text-blue-600">$350</span> - Samsung Galaxy S21 (4 days ago)
                        </li>
                        <li className="text-sm text-gray-600">
                          <span className="font-medium text-blue-600">$420</span> - Google Pixel 5 (1 week ago)
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <h3 className="text-lg font-semibold text-blue-600 mb-4">Customer Satisfaction</h3>
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-1/3 text-right">
                      <p className="text-sm text-gray-600">Negative</p>
                      <p className="text-lg font-bold text-red-600">12%</p>
                    </div>
                    <div className="w-1/3 bg-gray-200 h-4 rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div className="bg-red-500 w-3/12"></div>
                        <div className="bg-green-500 w-9/12"></div>
                      </div>
                    </div>
                    <div className="w-1/3 text-left">
                      <p className="text-sm text-gray-600">Positive</p>
                      <p className="text-lg font-bold text-green-600">88%</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Full-screen popups */}
      <AnimatePresence>
        {selectedRequest && !isAdjustingPrice && (
          <FullScreenPopup onClose={() => setSelectedRequest(null)}>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">{selectedRequest.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedRequest.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{selectedRequest.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Device</p>
                <p className="font-medium">{selectedRequest.device.brand} {selectedRequest.device.model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Storage</p>
                <p className="font-medium">{selectedRequest.device.storage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Condition</p>
                <p className="font-medium">{selectedRequest.condition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estimated Price</p>
                <p className="font-medium">${selectedRequest.estimatedPrice}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">{selectedRequest.verificationStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Serial Number / IMEI</p>
                <p className="font-medium">{selectedRequest.serialNumber}</p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Defects</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedRequest.defects.map((defect, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                    {defect}
                  </span>
                ))}
              </div>
            </div>
          </FullScreenPopup>
        )}
        {isAdjustingPrice && (
          <FullScreenPopup onClose={() => setIsAdjustingPrice(false)}>
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Adjust Price</h2>
            <p className="mb-2">Current Price: ${selectedRequest.estimatedPrice}</p>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
              className="w-full p-2 border rounded mb-4 outline"
            />
            <div className="flex justify-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAdjustingPrice(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={confirmPriceAdjustment}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Confirm
              </motion.button>
            </div>
          </FullScreenPopup>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHome;