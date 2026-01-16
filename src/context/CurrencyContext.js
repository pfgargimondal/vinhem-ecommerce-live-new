import { createContext, useContext, useEffect, useState } from "react";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {

 const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    return savedCurrency
      ? JSON.parse(savedCurrency)
      : {
          country: "India",
          currency_code: "INR",
          exchange_rate_to_inr: 1,
          locale: "en-IN",
        };
  });

  // ✅ Save to localStorage whenever it changes
  useEffect(() => {
    if (selectedCurrency) {
      localStorage.setItem("selectedCurrency", JSON.stringify(selectedCurrency));
    }
  }, [selectedCurrency]);

  const formatPrice = (priceInInr = 0, options = {}) => {

    const { showDecimals = false } = options;

    const currency = selectedCurrency || {
      currency_code: "INR",
      exchange_rate_to_inr: 1,
      locale: "en-IN",
    };


    const convertedPrice =
      priceInInr /
      (currency.exchange_rate_to_inr === 0
        ? 1
        : currency.exchange_rate_to_inr || 1);

    return new Intl.NumberFormat(currency.locale || "en-IN", {
      style: "currency",
      currency: currency.currency_code || "INR",
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(convertedPrice).replace("₹", "₹ ");;
  };


  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, formatPrice}}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
