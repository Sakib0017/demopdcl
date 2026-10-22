import React, { useState } from 'react';
import { Card, CardBody, Button } from '@material-tailwind/react';
import { motion } from 'framer-motion';
import LocationForm from './components/LocationForm';
import { checkAreaSurvey } from './utils/amarLabApi';

const AreaSurvey = ({ onBack }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheckCoverage = async (pincode) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await checkAreaSurvey(pincode);
      
      if (response.success) {
        setResult({
          pincode,
          available: response.data.available || false,
          message: response.data.message || '',
        });
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('Unable to check coverage. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#e2f0e5] p-4">
      <div className="max-w-2xl mx-auto">
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
                    Area Coverage Check
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Verify if AmarLab home sample collection is available in your area
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Coverage Check Form */}
          {!result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <LocationForm onSubmit={handleCheckCoverage} loading={loading} />
              
              {error && (
                <Card className="mt-4 border-red-200">
                  <CardBody>
                    <p className="text-red-600 text-center">{error}</p>
                  </CardBody>
                </Card>
              )}
            </motion.div>
          )}

          {/* Coverage Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`border-2 ${result.available ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <CardBody className="text-center">
                  <div className={`text-6xl mb-4 ${result.available ? 'text-green-500' : 'text-red-500'}`}>
                    {result.available ? '✓' : '✗'}
                  </div>
                  
                  <h3 className={`text-xl font-medium mb-2 ${result.available ? 'text-green-700' : 'text-red-700'}`}>
                    {result.available ? 'Service Available!' : 'Service Not Available'}
                  </h3>
                  
                  <p className="text-gray-600 mb-2">
                    PIN Code: <span className="font-medium">{result.pincode}</span>
                  </p>
                  
                  {result.message && (
                    <p className="text-gray-700 mb-6">
                      {result.message}
                    </p>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button
                      variant="outlined"
                      onClick={resetForm}
                      className="border-gray-300"
                    >
                      Check Another Area
                    </Button>
                    
                    {result.available && (
                      <Button
                        onClick={() => window.location.href = '/sample-collection/book'}
                        className="bg-[#006642] hover:bg-[#00984a]"
                      >
                        Book Sample Collection
                      </Button>
                    )}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AreaSurvey;