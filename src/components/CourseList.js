import React, { useState, useEffect } from "react";
import { getCourses, getSubjects } from "../services/courseService.js";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const CourseList = ({ darkMode }) => {
    const [courses, setCourses] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [start, setStart] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("courseNumber");
    const [order, setOrder] = useState("asc");
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("1XX"); // Default to "1XX"

    const limit = 10;

    const fetchCourses = async (
        reset = false,
        query = searchQuery,
        field = sortBy,
        direction = order,
        subject = selectedSubject,
        level = selectedLevel
    ) => {
        if (reset) {
            setCourses([]);
            setStart(0);
            setHasMore(true);
        }

        try {
            const newCourses = await getCourses(
                reset ? 0 : start,
                limit,
                field,
                direction,
                query,
                subject,
                level
            );
            setCourses((prev) => [...prev, ...newCourses]);
            if (newCourses.length < limit) {
                setHasMore(false);
            } else {
                setStart((prev) => prev + limit);
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };



    useEffect(() => {
        const initializeData = async () => {
            await fetchCourses(true);
            const allSubjects = await getSubjects();
            setSubjects(allSubjects.map((subject) => ({ value: subject, label: subject })));
        };
        initializeData();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        fetchCourses(true, query, sortBy, order, selectedSubject);
    };

    const handleSort = (option) => {
        const [field, direction] = option.value.split("-");
        setSortBy(field);
        setOrder(direction);
        fetchCourses(true, searchQuery, field, direction, selectedSubject);
    };

    const handleSubjectChange = (option) => {
        const subject = option ? option.value : "";
        setSelectedSubject(subject);
        fetchCourses(true, searchQuery, sortBy, order, subject);
    };

    return (
        <div
            className={`min-h-screen transition-colors duration-500 ${
                darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
            }`}
        >
            <div className="container mx-auto mt-6">
                <div className="max-w-3xl mx-auto">
                    <input
                        type="text"
                        className={`w-full px-4 py-2 mb-4 rounded border transition-colors duration-500 ${
                            darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"
                        }`}
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <Select
                        components={animatedComponents}
                        options={[
                            { value: "courseNumber-asc", label: "Course Number (Low-High)" },
                            { value: "courseNumber-desc", label: "Course Number (High-Low)" },
                            { value: "subject-asc", label: "Subject (A-Z)" },
                            { value: "subject-desc", label: "Subject (Z-A)" },
                        ]}
                        onChange={handleSort}
                        className="mb-4"
                        styles={{
                            control: (base) => ({
                                ...base,
                                background: darkMode ? "#374151" : "#ffffff",
                                color: darkMode ? "#ffffff" : "#000000",
                                borderColor: darkMode ? "#4b5563" : "#d1d5db",
                                transition: "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease",
                            }),
                            menu: (base) => ({
                                ...base,
                                background: darkMode ? "#374151" : "#ffffff",
                                color: darkMode ? "#ffffff" : "#000000",
                                transition: "background-color 0.5s ease, color 0.5s ease",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: darkMode ? "#ffffff" : "#000000",
                                transition: "color 0.5s ease",
                            }),
                            option: (base, state) => ({
                                ...base,
                                background: state.isFocused
                                    ? darkMode
                                        ? "#4b5563"
                                        : "#e5e7eb"
                                    : darkMode
                                        ? "#374151"
                                        : "#ffffff",
                                color: state.isFocused
                                    ? darkMode
                                        ? "#ffffff"
                                        : "#000000"
                                    : darkMode
                                        ? "#ffffff"
                                        : "#000000",
                                transition: "background-color 0.5s ease, color 0.5s ease",
                            }),
                        }}
                    />


                    <Select
                        components={animatedComponents}
                        options={subjects}
                        onChange={handleSubjectChange}
                        isClearable
                        placeholder="Select Subject"
                        className="mb-4"
                        styles={{
                            control: (base) => ({
                                ...base,
                                background: darkMode ? "#374151" : "#ffffff",
                                color: darkMode ? "#ffffff" : "#000000",
                                borderColor: darkMode ? "#4b5563" : "#d1d5db",
                                transition: "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease",
                            }),
                            menu: (base) => ({
                                ...base,
                                background: darkMode ? "#374151" : "#ffffff",
                                color: darkMode ? "#ffffff" : "#000000",
                                transition: "background-color 0.5s ease, color 0.5s ease",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: darkMode ? "#ffffff" : "#000000",
                                transition: "color 0.5s ease",
                            }),
                            option: (base, state) => ({
                                ...base,
                                background: state.isFocused
                                    ? darkMode
                                        ? "#4b5563"
                                        : "#e5e7eb"
                                    : darkMode
                                        ? "#374151"
                                        : "#ffffff",
                                color: state.isFocused
                                    ? darkMode
                                        ? "#ffffff"
                                        : "#000000"
                                    : darkMode
                                        ? "#ffffff"
                                        : "#000000",
                                transition: "background-color 0.5s ease, color 0.5s ease",
                            }),
                        }}
                    />

                    <div className="flex space-x-2 mb-4">
                        {["1XX", "2XX", "3XX", "4XX", "5XX", "6XX", "7XX"].map((level) => (
                            <button
                                key={level}
                                onClick={() => {
                                    setSelectedLevel(level); // Update selected level
                                    fetchCourses(true, searchQuery, sortBy, order, selectedSubject, level); // Fetch courses
                                }}
                                className={`px-3 py-1 rounded transition-colors duration-500 ${
                                    selectedLevel === level
                                        ? darkMode
                                            ? "bg-blue-700 text-white"
                                            : "bg-blue-500 text-white"
                                        : darkMode
                                            ? "bg-gray-800 text-gray-300"
                                            : "bg-gray-200 text-black"
                                }`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>





                </div>
                <InfiniteScroll
                    dataLength={courses.length}
                    next={() => fetchCourses()}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                >
                    <div className="max-w-3xl mx-auto">
                        {courses.map((course, index) => (
                            <div
                                key={`${course.id}-${index}`}
                                className={`p-4 mb-4 rounded shadow transition-colors duration-500 ${
                                    darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                                }`}
                            >
                                <h5 className="font-bold">
                                    <Link to={`/courses/${course.id}`} className="hover:underline">
                                        {course.title}
                                    </Link>
                                </h5>
                                <p>{course.description}</p>
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
};

export default CourseList;
