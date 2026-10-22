import React, { useState } from 'react';
import { Card, CardBody, Button, Input } from '@material-tailwind/react';
import { validatePincode } from '../utils/validations';

const LocationForm = ({ onSubmit, loading }) => {
  const [pincode, setPincode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validatePincode(pincode);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    onSubmit(pincode);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardBody>
        <h3 className="text-xl font-medium text-black font-ubuntu mb-4">
          Check Service Coverage
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          Enter your PIN code to check if AmarLab sample collection is available in your area
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="PIN Code"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                setError('');
              }}
              error={!!error}
              maxLength={6}
              placeholder="Enter 4-6 digit PIN code"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <Button
            type="submit"
            fullWidth
            className="bg-[#006642] hover:bg-[#00984a]"
            loading={loading}
            disabled={loading}
          >
            Check Coverage
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default LocationForm;