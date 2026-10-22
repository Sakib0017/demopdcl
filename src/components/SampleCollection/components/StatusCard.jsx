import React from 'react';
import { Card, CardBody } from '@material-tailwind/react';

const StatusCard = ({ orderData }) => {
  const getStatusColor = (status) => {
    const statusMap = {
      'confirmed': 'text-blue-600 bg-blue-50',
      'scheduled': 'text-blue-600 bg-blue-50',
      'in_progress': 'text-yellow-600 bg-yellow-50',
      'collected': 'text-green-600 bg-green-50',
      'completed': 'text-green-600 bg-green-50',
      'cancelled': 'text-red-600 bg-red-50',
    };
    return statusMap[status?.toLowerCase()] || 'text-gray-600 bg-gray-50';
  };

  const getStatusDescription = (status) => {
    const descriptions = {
      'confirmed': 'Your booking has been confirmed. Our team will contact you soon.',
      'scheduled': 'Sample collection has been scheduled. Agent will arrive at the specified time.',
      'in_progress': 'Our collection agent is on the way to your location.',
      'collected': 'Sample has been collected successfully and sent to the lab.',
      'completed': 'Sample processing completed. Reports are available.',
      'cancelled': 'This booking has been cancelled.',
    };
    return descriptions[status?.toLowerCase()] || 'Status information not available.';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardBody>
        <h3 className="text-xl font-medium text-black font-ubuntu mb-6">
          Order Details
        </h3>

        {/* Status Badge */}
        <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium mb-4 ${getStatusColor(orderData.status)}`}>
          {orderData.status?.toUpperCase() || 'UNKNOWN'}
        </div>

        {/* Status Description */}
        <p className="text-gray-700 mb-6">
          {getStatusDescription(orderData.status)}
        </p>

        {/* Order Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600 text-sm">Order ID</span>
              <p className="font-medium text-[#006642]">{orderData.order_id}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Patient Name</span>
              <p className="font-medium">{orderData.patient_name || 'Not available'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600 text-sm">Mobile Number</span>
              <p className="font-medium">{orderData.mobile || 'Not available'}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">PIN Code</span>
              <p className="font-medium">{orderData.pincode || 'Not available'}</p>
            </div>
          </div>

          {orderData.address && (
            <div>
              <span className="text-gray-600 text-sm">Address</span>
              <p className="font-medium">{orderData.address}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-gray-600 text-sm">Preferred Time Slot</span>
              <p className="font-medium capitalize">{orderData.slot || 'Not specified'}</p>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Booking Date</span>
              <p className="font-medium">{formatDate(orderData.created_at)}</p>
            </div>
          </div>

          {orderData.scheduled_date && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600 text-sm">Scheduled Date</span>
                <p className="font-medium">{formatDate(orderData.scheduled_date)}</p>
              </div>
              {orderData.collected_at && (
                <div>
                  <span className="text-gray-600 text-sm">Collected At</span>
                  <p className="font-medium">{formatDate(orderData.collected_at)}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Information */}
        {orderData.notes && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-600 text-sm block mb-2">Additional Notes</span>
            <p className="text-gray-800">{orderData.notes}</p>
          </div>
        )}

        {/* Contact Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
          <p className="text-blue-700 text-sm">
            For any queries regarding your sample collection, please contact AmarLab support at{' '}
            <span className="font-medium">+880 1700-000000</span> or email{' '}
            <span className="font-medium">support@amarlab.com</span>
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

export default StatusCard;