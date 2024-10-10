import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDropzone } from 'react-dropzone';
import { ChevronDown, Search, Check, Smartphone, Laptop, Tablet, X, Star, Upload, ArrowRight, ArrowLeft,CreditCard } from 'lucide-react';
import estimatePrice from '@/estimatedPrice/estimatedPrice';



const sellFormSchema = z.object({
  deviceType: z.enum(["smartphone", "laptop", "tablet"]),
  brand: z.string().min(1, { message: "Brand is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  yearOfPurchase: z.string(),
  condition: z.enum(["new", "used", "damaged"]),
  storageCapacity: z.string().min(1, { message: "Storage capacity is required" }),
  defects: z.array(z.string()),
  serialNumber: z.string().min(1, { message: "Serial number or IMEI is required" }).optional(),
  images: z.array(z.any()),
  deliveryMethod: z.enum(["pickup", "parcel"]),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Expiry date must be in MM/YY format" }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" }),
});




export default function EnhancedUserPortalWithMultiStepSellForm() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [activeSection, setActiveSection] = useState('pending');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isSellFormOpen, setIsSellFormOpen] = useState(false);
  const [sellFormStep, setSellFormStep] = useState(1);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
const [file,setFile] = useState(null)
  

  const { register: registerSell,reset: resetSell ,handleSubmit: handleSubmitSell, control, formState: { errors: sellErrors }, watch, trigger } = useForm({
    resolver: zodResolver(sellFormSchema)
  });
  const { register: registerPayment, handleSubmit: handleSubmitPayment, formState: { errors: paymentErrors } } = useForm({
    resolver: zodResolver(paymentSchema)
    });
  const serialNumber = watch('serialNumber')
  
const deviceType = watch("deviceType")
const storageCapacity = watch("storageCapacity")
const defects = watch("defects")
const condition  = watch("condition")
const yearOfPurchase = watch('yearOfPurchase')
const brand = watch("brand")
const onPaymentSubmit = (data) => {
  console.log("Payment data:", data);
  // Here you would typically process the payment
  setShowPaymentModal(false);
  };

  
  const [imagePreview, setImagePreview] = useState(null)
  const onSellSubmit = (data) => {
    console.log(data);
    alert(JSON.stringify(data))
    resetSell();
    alert(JSON.stringify(file))
    // Handle sell form submission here
    setShowConfirmModal(true);
  };

  const onDrop = useCallback((acceptedFiles) => {
    let file = acceptedFiles[0]
    setFile(file)
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] }
  });


  const user = {
    name: "John Doe",
    initials: "JD",
    isVerified: true
  };

  const items = {
    pending: [
      { id: 1, name: "iPhone 12 Pro", brand: "Apple", model: "12 Pro", type: "Smartphone", status: "Pending", condition: "Good", price: "$400", yearOfPurchase: 2020, storageCapacity: "128GB", defects: ["Minor scratches"], serialNumber: "IMEI123456789", images: ["/placeholder.svg?height=300&width=300"], rating: 4.5 },
      { id: 2, name: "MacBook Air M1", brand: "Apple", model: "Air M1", type: "Laptop", status: "Review", condition: "Excellent", price: "$700", adjustedPrice: "$650", yearOfPurchase: 2021, storageCapacity: "256GB", defects: [], serialNumber: "C02ABCDEFGH", images: ["/placeholder.svg?height=300&width=300"], rating: 4.8 },
    ],
    approved: [
      { id: 3, name: "Samsung Galaxy S21", brand: "Samsung", model: "Galaxy S21", type: "Smartphone", status: "Approved", condition: "Fair", price: "$300", yearOfPurchase: 2021, storageCapacity: "128GB", defects: ["Cracked screen"], serialNumber: "IMEI987654321", images: ["/placeholder.svg?height=300&width=300"], rating: 3.5 },
      { id: 4, name: "iPad Pro 12.9\"", brand: "Apple", model: "iPad Pro 12.9\"", type: "Tablet", status: "Approved", condition: "Like New", price: "$650", yearOfPurchase: 2022, storageCapacity: "256GB", defects: [], serialNumber: "DLXRP2LLABCD", images: ["/placeholder.svg?height=300&width=300"], rating: 4.9 },
    ],
    sold: [
      { id: 5, name: "Google Pixel 5", brand: "Google", model: "Pixel 5", type: "Smartphone", status: "Sold", condition: "Good", price: "$250", yearOfPurchase: 2020, storageCapacity: "128GB", defects: ["Battery issues"], serialNumber: "IMEI135792468", images: ["/placeholder.svg?height=300&width=300"], rating: 4.2 },
      { id: 6, name: "Dell XPS 13", brand: "Dell", model: "XPS 13", type: "Laptop", status: "Sold", condition: "Excellent", price: "$800", yearOfPurchase: 2021, storageCapacity: "512GB", defects: [], serialNumber: "1234567890", images: ["/placeholder.svg?height=300&width=300"], rating: 4.7 },
    ],
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Smartphone':
        return <Smartphone className="h-6 w-6" />;
      case 'Laptop':
        return <Laptop className="h-6 w-6" />;
      case 'Tablet':
        return <Tablet className="h-6 w-6" />;
      default:
        return <Smartphone className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Review':
        return 'bg-orange-100 text-orange-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSellFormStep = () => {
    switch (sellFormStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="deviceType" className="block text-sm font-medium text-gray-700">Device Type</label>
              <select
                id="deviceType"
                {...registerSell("deviceType")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="">Select a device type</option>
                <option value="smartphone">Smartphone</option>
                <option value="laptop">Laptop</option>
                <option value="tablet">Tablet</option>
                
              </select>
              {sellErrors.deviceType && <p className="mt-1 text-sm text-red-600">{sellErrors.deviceType.message}</p>}
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                id="brand"
                {...registerSell("brand")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {sellErrors.brand && <p className="mt-1 text-sm text-red-600">{sellErrors.brand.message}</p>}
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
              <input
                type="text"
                id="model"
                {...registerSell("model")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {sellErrors.model && <p className="mt-1 text-sm text-red-600">{sellErrors.model.message}</p>}
            </div>
            <div>
              <label htmlFor="yearOfPurchase" className="block text-sm font-medium text-gray-700">Year of Purchase</label>
              <input
                
                id="yearOfPurchase"
                {...registerSell("yearOfPurchase")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {sellErrors.yearOfPurchase && <p className="mt-1 text-sm text-red-600">{sellErrors.yearOfPurchase.message}</p>}
            </div>
            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
              <select
                id="condition"
                {...registerSell("condition")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="">Select condition</option>
                <option value="new">New</option>
                <option value="used">Used</option>
                <option value="damaged">Damaged</option>
              </select>
              {sellErrors.condition && <p className="mt-1 text-sm text-red-600">{sellErrors.condition.message}</p>}
            </div>
            <div>
              <label htmlFor="storageCapacity" className="block text-sm font-medium text-gray-700">Storage Capacity</label>
              <input
                type="text"
                id="storageCapacity"
                {...registerSell("storageCapacity")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {sellErrors.storageCapacity && <p className="mt-1 text-sm text-red-600">{sellErrors.storageCapacity.message}</p>}
            </div>
            <div>
              <label htmlFor="defects" className="block text-sm font-medium text-gray-700">Defects</label>
              <div className="mt-2 space-y-2">
                {['Screen cracks', 'Battery issues', 'Button malfunctions'].map((defect) => (
                  <div key={defect} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`defect-${defect}`}
                      value={defect}
                      {...registerSell("defects")}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <label htmlFor={`defect-${defect}`} className="ml-2 text-sm text-gray-700">{defect}</label>
                  </div>
                ))}
              </div>
              {sellErrors.defects && <p className="mt-1 text-sm text-red-600">{sellErrors.defects.message}</p>}
            </div>
            {deviceType==="smartphone" && 
            
            <div>
              <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">Serial Number/IMEI</label>
              <input
                type="text"
                id="serialNumber"
                {...registerSell("serialNumber")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              {sellErrors.serialNumber && <p className="mt-1 text-sm text-red-600">{sellErrors.serialNumber.message}</p>}
            </div>
    }
            <div>
              <label className="block text-sm font-medium text-gray-700">Images</label>
              <Controller
                name="images"
                control={control}
                defaultValue={[]}
                render={({ field }) => (
                  <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input {...getInputProps()} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                )}
              />
              {sellErrors.images && <p className="mt-1 text-sm text-red-600">{sellErrors.images.message}</p>}
            </div>
            {imagePreview && (
        <div className="mt-4">
          <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-md" />
        </div>
      )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Method</label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="pickup"
                    value="pickup"
                    {...registerSell("deliveryMethod")}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  
                  />
                  <label htmlFor="pickup" className="ml-3 block text-sm font-medium text-gray-700">
                    Pickup
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="parcel"
                    value="parcel"
                    {...registerSell("deliveryMethod")}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                  />
                  <label htmlFor="parcel" className="ml-3 block text-sm font-medium text-gray-700">
                    Parcel Service
                  </label>
                </div>
              </div>
              {sellErrors.deliveryMethod && <p className="mt-1 text-sm text-red-600">{sellErrors.deliveryMethod.message}</p>}
            </div>
            {watch("deliveryMethod") === "parcel" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h4 className="text-lg font-medium text-blue-800 mb-2">Mailing Instructions</h4>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-2">
                  <li>Package your device securely in a padded envelope or box.</li>
                  <li>Include all accessories and chargers if available.</li>
                  <li>Print and include the provided shipping label.</li>
                  <li>Drop off the package at your nearest post office or schedule a pickup.</li>
                </ol>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Estimated Price</h3>
            <div className="text-4xl font-bold text-blue-600">
              ${estimatedPrice}
            </div>
            <p className="text-sm text-gray-500">
              This is an estimated price based on the information you provided. The final offer may vary after our team reviews your device.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setShowConfirmModal(true)}
            >
              Accept and Submit
            </motion.button>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceedToNextStep = async () => {
    if (sellFormStep === 1) {
      const isValid = await trigger([
        "deviceType", "brand", "model", "yearOfPurchase", "condition", 
        "storageCapacity", "defects", "serialNumber", "images"
      ]);
      return isValid;
    } else if (sellFormStep === 2) {
      const isValid = await trigger(["deliveryMethod"]);
      return isValid;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <motion.a
                href="#"
                className="flex-shrink-0 text-blue-600 font-bold text-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">📱</span>BuyBack
              </motion.a>
              <motion.a
                href="#"
                className="ml-8 text-gray-700 hover:text-blue-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.a>
              <div className="ml-6 relative">
                <motion.button
                  className="flex items-center text-gray-700 hover:text-blue-600 focus:outline-none"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Items
                  <ChevronDown className="ml-1 h-4 w-4" />
                </motion.button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      className="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                        {['Pending', 'Approved', 'Sold'].map((item) => (
                          <a
                            key={item}
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            role="menuitem"
                            onClick={() => {
                              setActiveSection(item.toLowerCase());
                              setIsDropdownOpen(false);
                            }}
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center">
              
              <div className="relative">
                <motion.div
                  className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {user.initials}
                </motion.div>
                {user.isVerified && (
                  <motion.div
                    className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <motion.div
          className="px-4 py-6 sm:px-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => {
                setIsSellFormOpen(true);
                setSellFormStep(1);
                
              }}
            >
              Sell a Product
            </motion.button>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {items[activeSection].map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {getDeviceIcon(item.type)}
                        <h3 className="ml-2 text-lg font-medium text-gray-900">{item.name}</h3>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm text-gray-500">
                      <p>Type: {item.type}</p>
                      <p>Condition: {item.condition}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">
                        {item.status === 'Review' ? (
                          <span>
                            <span className="line-through text-gray-400 mr-2">{item.price}</span>
                            {item.adjustedPrice}
                          </span>
                        ) : (
                          item.price
                        )}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setSelectedDevice(item)}
                      >
                        View Details
                      </motion.button>
                      
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      <AnimatePresence>
        {selectedDevice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedDevice(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl overflow-hidden max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDevice.name}</h2>
                  <button onClick={() => setSelectedDevice(null)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="mb-6">
                  <img src={selectedDevice.images[0]} alt={selectedDevice.name} className="w-full h-64 object-cover rounded-lg" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Brand</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedDevice.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Model</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedDevice.model}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Year of Purchase</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedDevice.yearOfPurchase}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Condition</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedDevice.condition}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Storage Capacity</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedDevice.storageCapacity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Serial Number/IMEI</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedDevice.serialNumber}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900">Defects</h3>
                  {selectedDevice.defects.length > 0 ? (
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-500">
                      {selectedDevice.defects.map((defect, index) => (
                        <li key={index}>{defect}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">No defects reported</p>
                  )}
                </div>
                <div className="mt-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedDevice.status)}`}>
                    {selectedDevice.status}
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-3xl font-bold text-gray-900">
                    {selectedDevice.status === 'Review' ? (
                      <span>
                        <span className="line-through text-gray-400 mr-2">{selectedDevice.price}</span>
                        {selectedDevice.adjustedPrice}
                      </span>
                    ) : (
                      selectedDevice.price
                    )}
                  </p>
                </div>
                {selectedDevice.status === 'Approved' && (
                  
                <div style={{display:"flex",maxWidth:"100vw",justifyContent:"end"}}>

                <motion.button onClick={()=>setShowPaymentModal(true)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        
                      >
                        Select a payment Method
                      </motion.button>
                      </div>
)}
{selectedDevice.status === 'Review' && (
                  
                  <div style={{display:"flex",maxWidth:"100vw",justifyContent:"end"}}>
                    <div style={{display:"flex", gap:"10px"}}>
  
                  <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          
                        >
                          Reject
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          
                        >
                          Accept
                        </motion.button>
                        </div>
                        </div>
  )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPaymentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Enter Payment Details</h2>
                <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmitPayment(onPaymentSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="cardNumber"
                      {...registerPayment("cardNumber")}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  {paymentErrors.cardNumber && <p className="mt-1 text-sm text-red-600">{paymentErrors.cardNumber.message}</p>}
                </div>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      {...registerPayment("expiryDate")}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="MM/YY"
                    />
                    {paymentErrors.expiryDate && <p className="mt-1 text-sm text-red-600">{paymentErrors.expiryDate.message}</p>}
                  </div>
                  <div className="flex-1">
                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      {...registerPayment("cvv")}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="123"
                    />
                    {paymentErrors.cvv && <p className="mt-1 text-sm text-red-600">{paymentErrors.cvv.message}</p>}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Submit Payment
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSellFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setIsSellFormOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Sell Your Product</h2>
                <button onClick={() => {{setIsSellFormOpen(false)}
                resetSell();
                setFile(null)
                setImagePreview(null)
               }}  className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div className={`flex flex-col items-center ${sellFormStep === step ? 'text-blue-600' : 'text-gray-400'}`}>
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 ${sellFormStep === step ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-400'}`}>
                          {step}
                        </div>
                        <div className="mt-2 text-sm font-medium">
                          {step === 1 ? 'Device Info' : step === 2 ? 'Delivery' : 'Price'}
                        </div>
                      </div>
                      {step < 3 && (
                        <div className={`flex-1 h-0.5 ${sellFormStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto">
                <form onSubmit={handleSubmitSell(onSellSubmit)} className="space-y-4">
                  {renderSellFormStep()}
                </form>
              </div>
              <div className="flex justify-between mt-6">
                {sellFormStep > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setSellFormStep(sellFormStep - 1)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </motion.button>
                )}
                {sellFormStep < 3 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={async () => {
                      const canProceed = await canProceedToNextStep();
                      if (canProceed) {
                        const estimatedPrice = estimatePrice({
                         brand,
                          deviceType,
                          storageCapacity,
                          defects,
                          condition,
                          yearOfPurchase
                        })
                        alert(estimatedPrice)
                        setEstimatedPrice(estimatedPrice)
                        setSellFormStep(prevStep => prevStep + 1);
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Submission</h3>
              <p className="text-sm text-gray-500 mb-4">Are you sure you want to submit your device for Review?</p>
              <div className="flex justify-end space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowConfirmModal(false);
                    setShowSuccessAnimation(true);
                    setTimeout(() => {
                      setShowSuccessAnimation(false);
                      setIsSellFormOpen(false);
                    }, 2000);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-full p-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <Check className="text-green-500 w-16 h-16" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>   
      </div>
  );
}