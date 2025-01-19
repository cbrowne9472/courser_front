import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { searchCoursesAndProfessors } from "../services/courseService.js";

const LandingPage = ({ darkMode }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ courses: [], professors: [] });
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300); // 300ms debounce delay

        return () => clearTimeout(timer); // Cleanup previous timer
    }, [query]);

    // Fetch results when debouncedQuery changes
    useEffect(() => {
        const fetchResults = async () => {
            if (debouncedQuery.length > 0) {
                const searchResults = await searchCoursesAndProfessors(debouncedQuery);

                setResults({
                    courses: searchResults.courses,
                    professors: searchResults.professors,
                });
            } else {
                setResults({ courses: [], professors: [] });
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    const handleSearch = (event) => {
        setQuery(event.target.value); // Update query on input change
    };

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${
                darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
            }`}
        >
            <h1 className="text-4xl font-bold mb-4 text-center">
                Explore thousands of course and professor reviews from GMU students
            </h1>
            <div className="flex flex-col items-center w-full max-w-lg px-4 relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    className={`w-full px-4 py-2 mb-6 rounded border transition-colors duration-500 ${
                        darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"
                    }`}
                    placeholder="Search for courses or professors"
                />
                {debouncedQuery && (
                    <div
                        className={`absolute top-16 left-0 w-full bg-white shadow-lg rounded-md max-h-64 overflow-y-auto ${
                            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                        }`}
                    >
                        {results.courses.length > 0 && (
                            <div>
                                <h3 className="px-4 py-2 text-sm font-bold">Courses</h3>
                                <ul>
                                    {results.courses.map((course) => (
                                        <li
                                            key={course.id}
                                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                            <Link to={`/courses/${course.id}`}>
                                                {course.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {results.professors.length > 0 && (
                            <div>
                                <h3 className="px-4 py-2 text-sm font-bold">Professors</h3>
                                <ul>
                                    {results.professors.map((professor) => (
                                        <li
                                            key={professor.id}
                                            className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        >
                                            <Link to={`/professors/${professor.id}`}>
                                                {professor.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
                <Link
                    to="/courses"
                    className={`px-6 py-2 text-lg font-medium rounded transition-colors duration-500 hover:underline ${
                        darkMode ? "bg-blue-700 text-white" : "bg-blue-500 text-white"
                    }`}
                >
                    Explore All Courses →
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;




