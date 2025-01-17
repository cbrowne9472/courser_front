import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import CourseList from "./components/CourseList.js";
import AddCourseForm from "./components/AddCourseForm.js";
import CourseDetail from "./components/CourseDetail.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
import ProfessorComments from "./components/ProfessorComments.js";
import "./index.css"; // Import Tailwind CSS

const App = () => {
    const [refresh, setRefresh] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token")); // Initialize login state
    const [darkMode, setDarkMode] = useState(false);

    const handleCourseAdded = () => {
        setRefresh((prev) => !prev);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false); // Update login state
        window.location.href = "/login";
    };

    const toggleDarkMode = () => {
        setDarkMode((prevMode) => !prevMode);
    };

    const ProtectedRoute = ({ element }) => {
        const token = localStorage.getItem("token");
        return token ? element : <Navigate to="/login" />;
    };

    useEffect(() => {
        // Re-check login status when the token changes in localStorage
        setIsLoggedIn(!!localStorage.getItem("token"));
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);


    return (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>

        <Router>
            <nav className={`flex items-center justify-between px-6 py-4 transition-colors duration-500 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
                <div className="flex items-center space-x-4">
                    <a className="font-bold text-lg" href="/">Course Management</a>
                    <ul className="flex space-x-4">
                        <li><a className="hover:underline" href="/">Home</a></li>
                        <li><a className="hover:underline" href="/courses">Courses</a></li>
                        <li><a className="hover:underline" href="/add-course">Add Course</a></li>
                    </ul>
                </div>
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <button className="text-sm hover:underline" onClick={handleLogout}>Logout</button>
                    ) : (
                        <>
                            <a className="text-sm hover:underline" href="/login">Login</a>
                            <a className="text-sm hover:underline" href="/signup">Sign Up</a>
                        </>
                    )}
                    <button
                        className={`px-4 py-2 rounded ${darkMode ? "bg-gray-600 text-white" : "bg-gray-200 text-black"}`}
                        onClick={toggleDarkMode}
                    >
                        {darkMode ? "Light Mode" : "Dark Mode"}
                    </button>
                </div>
            </nav>
            <div className={`container mx-auto mt-6 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
                <Routes>
                    <Route path="/" element={<h3>Welcome to Course Management</h3>} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/courses" element={<CourseList key={refresh} darkMode={darkMode} />} />
                    <Route path="/add-course" element={<ProtectedRoute element={<AddCourseForm onCourseAdded={handleCourseAdded} />} />} />
                    <Route path="/courses/:courseId" element={<CourseDetail darkMode={darkMode} />} />
                    <Route
                        path="/professor/:professorId"
                        element={<ProfessorComments darkMode={darkMode} />}
                    />

                </Routes>
            </div>
        </Router>
        </div>
    );
};

export default App;
