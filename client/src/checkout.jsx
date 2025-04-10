import {
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Import useNavigate
import { axiosInstance } from '../utils/axios';

const styles = {
  container: {
    maxWidth: "500px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  cardElement: {
    margin: "1rem 0",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    background: "#556cd6",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
    marginTop: "1rem",
  },
  message: {
    marginTop: "1rem",
    padding: "1rem",
    borderRadius: "4px",
  },
  success: {
    background: "#e6ffed",
    color: "#238636",
  },
  error: {
    background: "#ffebee",
    color: "#d32f2f",
  },
};

export function CheckoutForm({ paymentIntentId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate(); 

  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState({ message: '', isSuccess: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentStatus({ message: '', isSuccess: false });

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    try {
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (paymentMethodError) {
        throw paymentMethodError;
      }

      const { data } = await axiosInstance.post('/confirm', {
        paymentIntentId: paymentIntentId,
        paymentMethodId: paymentMethod.id,
        returnUrl: 'http://localhost:4000/success'
      });

      setPaymentStatus({ 
        message: `Payment successful! Status: ${data.status}`,
        isSuccess: true 
      });

    
      navigate("/success");

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus({ 
        message: error.message || 'Payment failed',
        isSuccess: false 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={styles.cardElement}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }} />
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || isLoading}
        style={styles.button}
      >
        {isLoading ? 'Processing...' : 'Pay'}
      </button>

      {paymentStatus.message && (
        <div style={{
          ...styles.message,
          ...(paymentStatus.isSuccess ? styles.success : styles.error)
        }}>
          {paymentStatus.message}
        </div>
      )}
    </form>
  );
}
