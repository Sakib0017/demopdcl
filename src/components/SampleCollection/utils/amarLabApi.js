import axios from 'axios';

const AMARLAB_BASE_URL = 'https://api.amarlab.com/api/v1';

const amarLabApi = axios.create({
  baseURL: AMARLAB_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkAreaSurvey = async (pincode) => {
  try {
    const response = await amarLabApi.get(`/areasurvey?pincode=${pincode}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to check area coverage',
    };
  }
};

export const bookSampleCollection = async (bookingData) => {
  try {
    const response = await amarLabApi.post('/book', bookingData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to book sample collection',
    };
  }
};

export const getOrderStatus = async (orderId) => {
  try {
    const response = await amarLabApi.get(`/order/${orderId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch order status',
    };
  }
};

export default amarLabApi;