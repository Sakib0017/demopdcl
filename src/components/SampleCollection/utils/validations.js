export const validatePincode = (pincode) => {
  if (!pincode) return 'PIN code is required';
  if (!/^\d{4,6}$/.test(pincode)) return 'Please enter a valid PIN code (4-6 digits)';
  return '';
};

export const validateName = (name) => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
  return '';
};

export const validateMobile = (mobile) => {
  if (!mobile) return 'Mobile number is required';
  if (!/^[0-9]{11}$/.test(mobile)) return 'Please enter a valid 11-digit mobile number';
  return '';
};

export const validateAddress = (address) => {
  if (!address) return 'Address is required';
  if (address.length < 10) return 'Please enter a complete address';
  return '';
};

export const validateSlot = (slot) => {
  if (!slot) return 'Time slot is required';
  return '';
};

export const validateOrderId = (orderId) => {
  if (!orderId) return 'Order ID is required';
  if (orderId.length < 5) return 'Please enter a valid order ID';
  return '';
};