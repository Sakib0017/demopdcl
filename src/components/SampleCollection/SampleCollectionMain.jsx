import React, { useState } from 'react';
import { Card, CardBody, Button } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  CalendarDaysIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';
import AreaSurvey from './AreaSurvey';
import BookingStepper from './BookingStepper';
import OrderStatus from './OrderStatus';

const SampleCollectionMain = () => {
  const [currentView, setCurrentView] = useState('main');

  const navigateToView = (view) => {
    setCurrentView(view);
  };

  const navigateBack = () => {
    setCurrentView('main');
  };

  if (currentView === 'area-survey') {
    return <AreaSurvey onBack={navigateBack} />;
  }

  if (currentView === 'booking') {
    return <BookingStepper onBack={navigateBack} />;
  }

  if (currentView === 'status') {
    return <OrderStatus onBack={navigateBack} />;
  }

  return (
    <div className="min-h-screen bg-[#e2f0e5] p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <Card className="mb-8">
            <CardBody className="text-center">
              <div className="mb-6">
                <img 
                  src="/src/assets/Logos/Amarlab.webp" 
                  alt="AmarLab Logo" 
                  className="h-16 mx-auto mb-4"
                />
              </div>
              
              <h1 className="text-3xl font-medium text-black font-ubuntu mb-4">
                Home Sample Collection
              </h1>
              
              <p className="text-gray-600 text-lg mb-6">
                Convenient home sample collection service powered by <span className="font-medium text-[#006642]">AmarLab</span>
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Why Choose Home Collection?</h3>
                <ul className="text-sm text-green-700 text-left max-w-2xl mx-auto space-y-1">
                  <li>• Safe and hygienic sample collection at your doorstep</li>
                  <li>• Qualified phlebotomists with proper safety equipment</li>
                  <li>• Real-time tracking and SMS notifications</li>
                  <li>• No waiting time - schedule at your convenience</li>
                  <li>• Direct integration with PDCL laboratory services</li>
                </ul>
              </div>
            </CardBody>
          </Card>

          {/* Service Options */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Check Coverage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <div className="bg-blue-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MapPinIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-xl font-medium text-black font-ubuntu mb-3">
                    Check Coverage
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-6">
                    Verify if our home sample collection service is available in your area
                  </p>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    className="border-blue-500 text-blue-600 hover:bg-blue-50"
                    onClick={() => navigateToView('area-survey')}
                  >
                    Check Area Coverage
                  </Button>
                </CardBody>
              </Card>
            </motion.div>

            {/* Book Collection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <div className="bg-green-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <CalendarDaysIcon className="h-8 w-8 text-green-600" />
                  </div>
                  
                  <h3 className="text-xl font-medium text-black font-ubuntu mb-3">
                    Book Collection
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-6">
                    Schedule a convenient time for sample collection at your home or office
                  </p>
                  
                  <Button
                    fullWidth
                    className="bg-[#006642] hover:bg-[#00984a]"
                    onClick={() => navigateToView('booking')}
                  >
                    Book Now
                  </Button>
                </CardBody>
              </Card>
            </motion.div>

            {/* Track Order */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center p-6">
                  <div className="bg-yellow-50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MagnifyingGlassIcon className="h-8 w-8 text-yellow-600" />
                  </div>
                  
                  <h3 className="text-xl font-medium text-black font-ubuntu mb-3">
                    Track Order
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-6">
                    Monitor the status of your sample collection and get real-time updates
                  </p>
                  
                  <Button
                    fullWidth
                    variant="outlined"
                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                    onClick={() => navigateToView('status')}
                  >
                    Track My Order
                  </Button>
                </CardBody>
              </Card>
            </motion.div>
          </div>

          {/* Additional Information */}
          <Card className="mt-8">
            <CardBody>
              <h3 className="font-medium text-gray-800 mb-4 text-center">
                Frequently Asked Questions
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">What is the collection fee?</h4>
                  <p className="text-gray-600 text-sm">Home collection charges are minimal and will be communicated during booking confirmation.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">What are the available time slots?</h4>
                  <p className="text-gray-600 text-sm">We offer morning (8 AM-12 PM), afternoon (12 PM-4 PM), and evening (4 PM-8 PM) slots.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">How will I get my reports?</h4>
                  <p className="text-gray-600 text-sm">Reports will be available on the PDCL patient portal and can also be collected from any PDCL branch.</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Can I cancel or reschedule?</h4>
                  <p className="text-gray-600 text-sm">Yes, you can cancel or reschedule by contacting AmarLab support at least 2 hours before the scheduled time.</p>
                </div>
              </div>

              <div className="text-center mt-6 pt-6 border-t">
                <p className="text-gray-600 text-sm">
                  For support, contact AmarLab at <span className="font-medium">+880 1700-000000</span> or 
                  email <span className="font-medium">support@amarlab.com</span>
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SampleCollectionMain;