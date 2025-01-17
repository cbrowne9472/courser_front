import React, { useState, useEffect, useCallback } from "react";
import { getCourses, searchCourses } from "../services/courseService.js";
import InfiniteScroll from "react-infinite-scroll-component";
import "bootstrap/dist/css/bootstrap.min.css";

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [start, setStart] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const limit = 10;

    // Debounce function to limit API calls
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };

    // Fetch courses for infinite scroll
    const fetchCourses = async (reset = false) => {
        if (reset) {
            setCourses([]); // Clear existing courses
            setStart(0); // Reset start index
            setHasMore(true); // Re-enable infinite scroll
        }

        const newCourses = await getCourses(reset ? 0 : start, limit);
        setCourses((prev) => [...prev, ...newCourses]);
        if (newCourses.length < limit) {
            setHasMore(false); // No more courses to load
        } else {
            setStart((prev) => prev + limit); // Increment start for the next batch
        }
    };

    // Fetch search results
    const fetchSearchResults = async (query) => {
        if (query.trim() === "") {
            fetchCourses(true); // Reset to infinite scroll when search is cleared
        } else {
            const searchResults = await searchCourses(query);
            setCourses(searchResults); // Replace course list with search results
            setHasMore(false); // Disable infinite scroll during search
        }
    };

    // Debounced search function
    const debouncedFetchSearchResults = useCallback(
        debounce((query) => fetchSearchResults(query), 300), // 300ms delay
        []
    );

    // Handle search input
    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setCourses([]); // Clear current courses immediately for real-time updates
        debouncedFetchSearchResults(query); // Trigger debounced API call
    };

    useEffect(() => {
        fetchCourses(); // Initial fetch
    }, []); // Run once on component mount

    return (
        <div>
            {/* Search Bar */}
            <div className="container mt-4" style={{ maxWidth: "800px" }}>
                <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={handleSearch}
                />
            </div>

            {/* Infinite Scroll for Course List */}
            <InfiniteScroll
                dataLength={courses.length}
                next={() => fetchCourses()} // Fetch more courses
                hasMore={hasMore && searchQuery.trim() === ""} // Disable infinite scroll during search
                loader={<h4>Loading...</h4>}
                endMessage={<p>No more courses available.</p>}
            >
                <div className="container mt-4" style={{ maxWidth: "800px" }}>
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <div key={course.id} className="card mb-3">
                                <div className="card-body">
                                    <h5 className="card-title">{course.title}</h5>
                                    <p className="card-text">{course.description}</p>
                                    {course.additionalInfo && (
                                        <p className="card-text text-muted">
                                            {course.additionalInfo}
                                        </p>
                                    )}
                                    <p className="card-text">
                                        <strong>Rating:</strong> {course.rating.toFixed(1)}
                                    </p>
                                    <a
                                        href={`/course/${course.id}`}
                                        className="btn btn-primary"
                                    >
                                        View Details
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : searchQuery.trim() !== "" ? (
                        <p className="text-muted">No courses found for "{searchQuery}".</p>
                    ) : (
                        <p className="text-muted">Start typing to search for courses...</p>
                    )}
                </div>
            </InfiniteScroll>
        </div>
    );
};

export default CourseList;
