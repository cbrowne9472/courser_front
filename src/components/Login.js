import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/authenticate`,
                { username, password },
                { headers: { "Content-Type": "application/json" } }
            );
            
            console.log(response);

            localStorage.setItem("token", response.data); // Save JWT token
            setIsLoggedIn(true); // Update login state
            navigate("/courses");
        } catch (error) {
            console.error("Login error:", error.response ? error.response.data : error.message);
            alert(
                error.response && error.response.data
                    ? `Error: ${error.response.data}`
                    : "Login failed. Please try again."
            );
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};

export default Login;
