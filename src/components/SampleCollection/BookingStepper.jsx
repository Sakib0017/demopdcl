import React, { useState } from 'react';
import { Card, CardBody } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import PatientDetailsForm from './components/PatientDetailsForm';
import BookingConfirmation from './components/BookingConfirmation';
import { bookSampleCollection } from './utils/amarLabApi';

const BookingStepper = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState('');

  const handleBooking = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const response = await bookSampleCollection(formData);
      
      if (response.success) {
        setBookingResult({
          order_id: response.data.order_id,
          patient_name: formData.name,
          mobile: formData.mobile,
          slot: formData.slot,
          status: response.data.status,
        });
        setCurrentStep(2);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Unable to book sample collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    onBack();
  };

  const handleTrackOrder = (orderId) => {
    window.location.href = `/sample-collection/status?order=${orderId}`;
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
              <h1 className="text-2xl font-medium text-black font-ubuntu mb-2">
                Book Sample Collection
              </h1>
              <p className="text-gray-600 text-sm">
                Schedule AmarLab home sample collection service
              </p>
              
              {/* Progress Indicator */}
              <div className="flex items-center mt-6">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 1 ? 'bg-[#006642] text-white' : 'bg-gray-200'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep >= 2 ? 'bg-[#006642]' : 'bg-gray-200'
                }`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  currentStep >= 2 ? 'bg-[#006642] text-white' : 'bg-gray-200'
                }`}>
                  2
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>Patient Details</span>
                <span>Confirmation</span>
              </div>
            </CardBody>
          </Card>

          {/* Step Content */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PatientDetailsForm
                onSubmit={handleBooking}
                onBack={onBack}
                loading={loading}
              />
              
              {error && (
                <Card className="mt-4 border-red-200">
                  <CardBody>
                    <p className="text-red-600 text-center">{error}</p>
                  </CardBody>
                </Card>
              )}
            </motion.div>
          )}

          {currentStep === 2 && bookingResult && (
            <BookingConfirmation
              bookingData={bookingResult}
              onBackHome={handleBackHome}
              onTrackOrder={handleTrackOrder}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BookingStepper;