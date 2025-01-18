import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, BellIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import CourseList from "./components/CourseList.js";
import AddCourseForm from "./components/AddCourseForm.js";
import CourseDetail from "./components/CourseDetail.js";
import Login from "./components/Login.js";
import SignUp from "./components/SignUp.js";
import ProfessorComments from "./components/ProfessorComments.js";
import "./index.css"; // Import Tailwind CSS

const navigation = [
    { name: "Home", href: "/", current: true },
    { name: "Courses", href: "/courses", current: false }

];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

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
        <div
            className={`min-h-screen transition-colors duration-500 ${
                darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
            }`}
        >
            <Router>
                <Disclosure as="nav" className={`${darkMode ? "bg-gray-800" : "bg-white shadow"}`}>
                    {({ open }) => (
                        <>
                            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                                <div className="relative flex h-16 items-center justify-between">
                                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                        <div className="flex flex-shrink-0 items-center">
                                            <div className="flex flex-shrink-0 items-center">
                                                <Link to="/">
                                                    <img
                                                        src="/resources/mason.png"
                                                        alt="Logo"
                                                        className="h-8 w-auto bg-transparent"
                                                    />
                                                </Link>
                                            </div>

                                        </div>

                                        <div className="hidden sm:ml-6 sm:block">
                                            <div className="flex space-x-4">
                                                {navigation.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        to={item.href}
                                                        className={classNames(
                                                            item.current
                                                                ? darkMode
                                                                    ? "text-white underline" // Active link style in dark mode
                                                                    : "text-black underline" // Active link style in light mode
                                                                : darkMode
                                                                    ? "text-gray-300 hover:text-white" // Inactive link style in dark mode
                                                                    : "text-gray-700 hover:text-black", // Inactive link style in light mode
                                                            "px-3 py-2 text-sm font-medium"
                                                        )}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}


                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                        <button
                                            onClick={toggleDarkMode}
                                            type="button"
                                            className="rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <span className="sr-only">Toggle dark mode</span>
                                            {darkMode ? (
                                                <SunIcon className="h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <MoonIcon className="h-6 w-6" aria-hidden="true" />
                                            )}
                                        </button>

                                        {!isLoggedIn ? (
                                            <div className="ml-3 flex items-center space-x-4">
                                                <Link
                                                    to="/login"
                                                    className={classNames(
                                                        darkMode
                                                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                                            : "text-gray-700 hover:bg-gray-200 hover:text-black",
                                                        "rounded-md px-3 py-2 text-sm font-medium"
                                                    )}
                                                >
                                                    Login
                                                </Link>
                                                <Link
                                                    to="/signup"
                                                    className={classNames(
                                                        darkMode
                                                            ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                                            : "text-gray-700 hover:bg-gray-200 hover:text-black",
                                                        "rounded-md px-3 py-2 text-sm font-medium"
                                                    )}
                                                >
                                                    Sign Up
                                                </Link>
                                            </div>
                                        ) : (
                                            <Menu as="div" className="relative ml-3">
                                                <div>
                                                    <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <span className="sr-only">Open user menu</span>
                                                        <img
                                                            className="h-8 w-8 rounded-full"
                                                            src="/resources/mascot.png"
                                                            alt="Mascot"
                                                        />
                                                    </Menu.Button>
                                                </div>
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <a
                                                                href="#"
                                                                className={classNames(
                                                                    active ? "bg-gray-100" : "",
                                                                    "block px-4 py-2 text-sm text-gray-700"
                                                                )}
                                                            >
                                                                Your Profile
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                    {/*<Menu.Item>*/}
                                                    {/*    {({ active }) => (*/}
                                                    {/*        <a*/}
                                                    {/*            href="#"*/}
                                                    {/*            className={classNames(*/}
                                                    {/*                active ? "bg-gray-100" : "",*/}
                                                    {/*                "block px-4 py-2 text-sm text-gray-700"*/}
                                                    {/*            )}*/}
                                                    {/*        >*/}
                                                    {/*            Settings*/}
                                                    {/*        </a>*/}
                                                    {/*    )}*/}
                                                    {/*</Menu.Item>*/}
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={handleLogout}
                                                                className={classNames(
                                                                    active ? "bg-gray-100" : "",
                                                                    "block px-4 py-2 text-sm text-gray-700 w-full text-left"
                                                                )}
                                                            >
                                                                Sign out
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Menu>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Disclosure.Panel className="sm:hidden">
                                <div className="space-y-1 px-2 pb-3 pt-2">
                                    {navigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className={classNames(
                                                item.current
                                                    ? "bg-gray-900 text-white"
                                                    : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                                "block rounded-md px-3 py-2 text-base font-medium"
                                            )}
                                            aria-current={item.current ? "page" : undefined}
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>

                <div className={`container mx-auto mt-6`}>
                    <Routes>
                        <Route path="/" element={<h3>Welcome to Course Management</h3>} />
                        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/courses" element={<CourseList key={refresh} darkMode={darkMode} />} />
                        <Route path="/add-course" element={<ProtectedRoute element={<AddCourseForm onCourseAdded={handleCourseAdded} />} />} />
                        <Route path="/courses/:courseId" element={<CourseDetail darkMode={darkMode} />} />
                        <Route path="/professor/:professorId" element={<ProfessorComments darkMode={darkMode} />} />
                    </Routes>
                </div>
            </Router>
        </div>
    );
};

export default App;

