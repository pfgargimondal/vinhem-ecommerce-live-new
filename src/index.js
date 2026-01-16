import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { FilterProvider } from './context/FilterContext';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthModalProvider } from './context/AuthModalContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <CurrencyProvider>
        <AuthProvider>
          <FilterProvider>
            <CartProvider>
              <WishlistProvider>
                <PayPalScriptProvider options={{ "client-id": "Ac3LBYSEf-1c0Y37LZOTUEZgOdN_k05H_tU50qLlU2lfrHGK0w4VV6FuJYY5jBb3faC3O5FwZsgExAVp" }}>
                  <GoogleOAuthProvider clientId="979908862202-qcs1ft90v0fkbigt3ec44atq3alt1m38.apps.googleusercontent.com">
                    <AuthModalProvider>
                      <App />
                    </AuthModalProvider>
                  </GoogleOAuthProvider>
                </PayPalScriptProvider>
              </WishlistProvider>
            </CartProvider>
          </FilterProvider>
        </AuthProvider>
      </CurrencyProvider>
    </Router>
  </React.StrictMode>
);