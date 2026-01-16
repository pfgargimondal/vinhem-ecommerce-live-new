import { createContext, useContext, useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const initialState = {
  token: localStorage.getItem("jwtToken"),
  user: JSON.parse(localStorage.getItem("user")) || null,
};

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, token: action.payload.token, user: action.payload.user };

    case "LOGOUT":
      return { token: null, user: null };

    case "UPDATE_PROFILE":
      return { ...state, user: { ...state.user, ...action.payload } };

    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ✅ If token exists but no user, fetch profile
  useEffect(() => {
    if (state.token && !state.user) {
      fetch("/api/user/profile", {
        headers: { Authorization: `Bearer ${state.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            dispatch({ type: "UPDATE_PROFILE", payload: data.user });
          }
        })
        .catch(() => {
          // token might be invalid → logout
          localStorage.clear();
          navigate("/login");
        });
    }
  }, [state.token, state.user, dispatch, navigate]);

  // ✅ Custom dispatch with side effects
  const customDispatch = (action) => {
    switch (action.type) {
      case "LOGIN":
        localStorage.setItem("jwtToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        dispatch(action);
        navigate("/"); // redirect home
        break;

      case "LOGOUT":
        localStorage.clear();
        dispatch(action);
        // navigate("/login"); // redirect login
        break;

      case "UPDATE_PROFILE":
        localStorage.setItem("user", JSON.stringify({ ...state.user, ...action.payload }));
        dispatch(action);
        break;

      default:
        dispatch(action);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, dispatch: customDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
