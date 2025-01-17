import React, { useState, useEffect } from "react";
import { getCourses, getSubjects } from "../services/courseService.js";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

const CourseList = ({ darkMode }) => {
    const [courses, setCourses] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [start, setStart] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("courseNumber");
    const [order, setOrder] = useState("asc");
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");

    const limit = 10;

    const fetchCourses = async (reset = false, query = searchQuery, field = sortBy, direction = order, subject = selectedSubject) => {
        if (reset) {
            setCourses([]);
            setStart(0);
            setHasMore(true);
        }

        try {
            const newCourses = await getCourses(reset ? 0 : start, limit, field, direction, query, subject);
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
            setSubjects(allSubjects);
        };
        initializeData();
    }, []);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        fetchCourses(true, query, sortBy, order, selectedSubject);
    };

    const handleSort = (event) => {
        const [field, direction] = event.target.value.split("-");
        setSortBy(field);
        setOrder(direction);
        fetchCourses(true, searchQuery, field, direction, selectedSubject);
    };

    const handleSubjectChange = (event) => {
        const subject = event.target.value;
        setSelectedSubject(subject);
        fetchCourses(true, searchQuery, sortBy, order, subject);
    };

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
            <div className="container mx-auto mt-6">
                <div className="max-w-3xl mx-auto">
                    <input
                        type="text"
                        className={`w-full px-4 py-2 mb-4 rounded border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                    <select
                        className={`w-full px-4 py-2 mb-4 rounded border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}
                        onChange={handleSort}
                    >
                        <option value="courseNumber-asc">Course Number (Low-High)</option>
                        <option value="courseNumber-desc">Course Number (High-Low)</option>
                        <option value="subject-asc">Subject (A-Z)</option>
                        <option value="subject-desc">Subject (Z-A)</option>
                    </select>
                    <select
                        className={`w-full px-4 py-2 mb-4 rounded border ${darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-black"}`}
                        onChange={handleSubjectChange}
                        value={selectedSubject}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map((subject) => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
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
                                key={`${course.id}-${index}`} // Composite key: combines ID with index
                                className={`p-4 mb-4 rounded shadow ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}
                            >
                                <h5 className="font-bold">
                                    <Link to={`/courses/${course.id}`} className="hover:underline">
                                        {course.title}
                                    </Link>
                                </h5>
                                <p>{course.description}</p>
                                <p className="text-sm">Subject: {course.subject}</p>
                            </div>
                        ))}

                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );

};

export default CourseList;
