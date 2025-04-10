import { useState } from "react";
import { stripePromise } from "../utils/stripe";
import { axiosInstance } from "../utils/axios";
import { Routes, Route, useNavigate, BrowserRouter } from "react-router-dom";
import { CheckoutForm } from "./checkout";
import Success from "./success";
import { Elements } from "@stripe/react-stripe-js";

const styles = {
  container: {
    maxWidth: "500px",
    margin: "2rem auto",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#ffffff",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    color: "#333",
    marginBottom: "1rem",
  },
  description: {
    color: "#666",
    fontSize: "1rem",
    marginBottom: "1.5rem",
  },
  button: {
    background: "#556cd6",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  info: {
    marginTop: "1rem",
    color: "#888",
    fontStyle: "italic",
  },
};


function AppContent() {
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate(); 

  const createPaymentIntent = async () => {
    try {
      const { data } = await axiosInstance.post("/create", {
        amount: 1000,
        currency: "usd",
      });
      setClientSecret(data.paymentIntentClientSecret);
      setPaymentIntentId(data.paymentIntentId);
      navigate("/checkout"); 
    } catch (err) {
      console.error("Failed to create payment intent:", err);
      setError(err.response?.data?.error || "Failed to initialize payment");
    }
  };

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  if (error) return <div style={styles.container}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>💳 Complete Your Payment</h1>
      <p style={styles.description}>
        Click the button below to generate a payment intent and proceed to checkout.
      </p>
      <button style={styles.button} onClick={createPaymentIntent}>
        Create Payment Intent
      </button>
    
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <Routes>
            <Route
              path="/checkout"
              element={<CheckoutForm paymentIntentId={paymentIntentId} />}
            />
            <Route path="/success" element={<Success />} />
          </Routes>
        </Elements>
      ) : (
        <p style={styles.info}>Please create a payment intent to proceed.</p>
      )}
    </div>

  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
