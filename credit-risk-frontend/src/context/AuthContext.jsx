import {
    createContext,
    useContext,
    useState
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [role, setRole] = useState(
        localStorage.getItem("role")
    );

    const login = (token, role, name, email) => {

        localStorage.setItem("token", token);

        localStorage.setItem("role", role);

        localStorage.setItem("user_name", name);

        localStorage.setItem("user_email", email);

        setToken(token);

        setRole(role);
    };

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("role");

        localStorage.removeItem("user_name");

        localStorage.removeItem("user_email");

        setToken(null);

        setRole(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};