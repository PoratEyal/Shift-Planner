import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ component: Component, role }) {
    const [userRole, setUserRole] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const isAuth = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
            } else {
                try {
                    const config = {
                        headers: { Authorization: `Bearer ${token}` },
                    };
                    const response = await axios.get(
                        `${process.env.REACT_APP_URL}/GetUserRole`,
                        config,
                    );
                    const user = response.data;
                    if (user) {
                        setUserRole(user.job);
                    } else {
                        navigate("/");
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    navigate("/");
                }
            }
        };

        isAuth();
    }, [navigate]);

    return <>{userRole === role ? <Component /> : null}</>;
}

export default ProtectedRoute;
