import React, { useState } from 'react';
import { Card, CardBody, Button, Input, Textarea, Select, Option } from '@material-tailwind/react';
import { validateName, validateMobile, validatePincode, validateAddress, validateSlot } from '../utils/validations';

const PatientDetailsForm = ({ onSubmit, loading, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    pincode: '',
    address: '',
    slot: ''
  });

  const [errors, setErrors] = useState({});

  const timeSlots = [
    { value: 'morning', label: 'Morning (8:00 AM - 12:00 PM)' },
    { value: 'afternoon', label: 'Afternoon (12:00 PM - 4:00 PM)' },
    { value: 'evening', label: 'Evening (4:00 PM - 8:00 PM)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      mobile: validateMobile(formData.mobile),
      pincode: validatePincode(formData.pincode),
      address: validateAddress(formData.address),
      slot: validateSlot(formData.slot)
    };

    const hasErrors = Object.values(newErrors).some(error => error);
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardBody>
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="text"
            onClick={onBack}
            className="p-2 text-[#006642]"
          >
            ← Back
          </Button>
          <div>
            <h3 className="text-xl font-medium text-black font-ubuntu">
              Patient Details
            </h3>
            <p className="text-gray-600 text-sm">
              Please fill in your information for sample collection
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Patient Name */}
            <div>
              <Input
                label="Patient Name *"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <Input
                label="Mobile Number *"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                error={!!errors.mobile}
                maxLength={11}
                placeholder="01XXXXXXXXX"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>

            {/* PIN Code */}
            <div>
              <Input
                label="PIN Code *"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                error={!!errors.pincode}
                maxLength={6}
                placeholder="Enter 4-6 digit PIN code"
              />
              {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
            </div>

            {/* Address */}
            <div>
              <Textarea
                label="Complete Address *"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                error={!!errors.address}
                rows={3}
                placeholder="Enter your complete address including house/flat number, street, area"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            {/* Time Slot */}
            <div>
              <Select 
                label="Preferred Time Slot *"
                value={formData.slot}
                onChange={(value) => handleInputChange('slot', value)}
                error={!!errors.slot}
              >
                {timeSlots.map((slot) => (
                  <Option key={slot.value} value={slot.value}>
                    {slot.label}
                  </Option>
                ))}
              </Select>
              {errors.slot && <p className="text-red-500 text-sm mt-1">{errors.slot}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              fullWidth
              className="bg-[#006642] hover:bg-[#00984a]"
              loading={loading}
              disabled={loading}
            >
              Book Sample Collection
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default PatientDetailsForm;