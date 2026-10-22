import React from 'react';
import { Card, CardBody, Button } from '@material-tailwind/react';
import { motion } from 'framer-motion';

const BookingConfirmation = ({ bookingData, onBackHome, onTrackOrder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-2xl mx-auto border-2 border-green-200 bg-green-50">
        <CardBody className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          
          <h2 className="text-2xl font-medium text-green-700 mb-4 font-ubuntu">
            Booking Confirmed!
          </h2>
          
          <div className="bg-white p-4 rounded-lg mb-6 text-left">
            <h3 className="font-medium text-gray-800 mb-3">Booking Details:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium text-[#006642]">{bookingData.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Patient Name:</span>
                <span className="font-medium">{bookingData.patient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mobile:</span>
                <span className="font-medium">{bookingData.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Slot:</span>
                <span className="font-medium capitalize">{bookingData.slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-blue-600">{bookingData.status || 'Confirmed'}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• Our collection agent will contact you within 2 hours</li>
              <li>• Sample will be collected at your preferred time slot</li>
              <li>• You'll receive SMS updates about collection status</li>
              <li>• Reports will be available on our patient portal</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outlined"
              onClick={onBackHome}
              className="border-gray-300"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => onTrackOrder(bookingData.order_id)}
              className="bg-[#006642] hover:bg-[#00984a]"
            >
              Track This Order
            </Button>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default BookingConfirmation;