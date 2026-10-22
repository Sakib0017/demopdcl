import React, { useState, useEffect } from 'react';
import { Card, CardBody, Button, Input } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import StatusCard from './components/StatusCard';
import { getOrderStatus } from './utils/amarLabApi';
import { validateOrderId } from './utils/validations';

const OrderStatus = ({ onBack }) => {
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderParam = urlParams.get('order');
    if (orderParam) {
      setOrderId(orderParam);
      handleSearch(orderParam);
    }
  }, []);

  const handleSearch = async (searchOrderId = orderId) => {
    const validationErr = validateOrderId(searchOrderId);
    if (validationErr) {
      setValidationError(validationErr);
      return;
    }

    setValidationError('');
    setLoading(true);
    setError('');
    setOrderData(null);

    try {
      const response = await getOrderStatus(searchOrderId);
      
      if (response.success) {
        setOrderData(response.data);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Unable to fetch order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value) => {
    setOrderId(value);
    if (validationError) {
      setValidationError('');
    }
    if (error) {
      setError('');
    }
  };

  const resetSearch = () => {
    setOrderId('');
    setOrderData(null);
    setError('');
    setValidationError('');
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-[#e2f0e5] p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Card className="mb-6">
            <CardBody>
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="text"
                  onClick={onBack}
                  className="p-2 text-[#006642]"
                >
                  ← Back
                </Button>
                <div>
                  <h1 className="text-2xl font-medium text-black font-ubuntu">
                    Track Sample Collection
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Enter your order ID to check the status of your sample collection
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Search Form */}
          {!orderData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="mb-6">
                <CardBody>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        label="Order ID"
                        value={orderId}
                        onChange={(e) => handleInputChange(e.target.value)}
                        error={!!validationError}
                        placeholder="Enter your order ID (e.g., AL123456)"
                      />
                      {validationError && (
                        <p className="text-red-500 text-sm mt-1">{validationError}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleSearch()}
                      loading={loading}
                      disabled={loading || !orderId}
                      className="bg-[#006642] hover:bg-[#00984a]"
                    >
                      Track Order
                    </Button>
                  </div>
                </CardBody>
              </Card>

              {error && (
                <Card className="border-red-200 mb-6">
                  <CardBody>
                    <p className="text-red-600 text-center">{error}</p>
                  </CardBody>
                </Card>
              )}
            </motion.div>
          )}

          {/* Order Status Result */}
          {orderData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <StatusCard orderData={orderData} />
              
              <div className="flex justify-center mt-6">
                <Button
                  variant="outlined"
                  onClick={resetSearch}
                  className="border-gray-300"
                >
                  Search Another Order
                </Button>
              </div>
            </motion.div>
          )}

          {/* Help Section */}
          {!orderData && (
            <Card className="mt-6">
              <CardBody>
                <h3 className="font-medium text-gray-800 mb-3">Need Help Finding Your Order ID?</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Check the confirmation SMS sent to your registered mobile number</li>
                  <li>• Look for the order ID in your booking confirmation screen</li>
                  <li>• Contact AmarLab support at +880 1700-000000 for assistance</li>
                </ul>
              </CardBody>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrderStatus;