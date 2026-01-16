import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import http from "../http";
import { toast } from "react-toastify";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { token } = useAuth();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistIds, setWishlistIds] = useState([]);

  // ✅ Fetch wishlist from API
  const fetchWishlist = useCallback(async () => {
    if (!token) {
      setWishlistCount(0);
      setWishlistIds([]);
      return;
    }

    try {
      const res = await http.get("/user/get-wishlist", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data.data.map((item) => item.product_id);
      setWishlistIds(ids);
      setWishlistCount(ids.length);

    } catch (err) {
      console.error("Error fetching wishlist", err);
      setWishlistIds([]);
      setWishlistCount(0);
    }
    
  }, [token]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  

  // ✅ Add to wishlist
  const addToWishlist = async (productId) => {
    if (!token) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      const res = await http.post(
        "/user/user-add-wishlist",
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!wishlistIds.includes(productId)) {
        setWishlistIds((prev) => [...prev, productId]);
        setWishlistCount((prev) => prev + 1);
      }

      toast.success(res.data.message || "Product added to wishlist");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  // ✅ Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!token) {
      toast.error("Please login to remove from wishlist");
      return;
    }

    try {
      const res = await http.post(
        "/user/user-remove-wishlist",
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWishlistIds((prev) => prev.filter((id) => id !== productId));
      setWishlistCount((prev) => Math.max(0, prev - 1));

      toast.success(res.data.message || "Product removed from wishlist");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove from wishlist");
    }
  };

  // ✅ When login/logout happens
  useEffect(() => {
    if (token) {
      fetchWishlist();
    } else {
      setWishlistIds([]);
      setWishlistCount(0);
    }
  }, [token, fetchWishlist]);

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, wishlistCount, addToWishlist, removeFromWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
