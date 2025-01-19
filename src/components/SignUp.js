import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await axios.post(`${API_BASE_URL}/auth/register/user`, {
                username,
                email,
                password,
            });
            alert("Signup successful! You can now log in.");
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (error) {
            console.error("Signup failed", error);
            alert("Error signing up. Please try again.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Sign Up</h2>
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
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                <button type="submit" className="btn btn-primary">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
