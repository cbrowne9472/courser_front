import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCourseById, getProfessorsByCourseId } from "../services/courseService.js";
import { Link } from "react-router-dom";

const CourseDetail = ({ darkMode }) => {
    const { courseId } = useParams(); // Get course ID from URL
    const [course, setCourse] = useState(null);
    const [professors, setProfessors] = useState([]); // State for professors

    useEffect(() => {
        const fetchCourseDetails = async () => {
            const courseData = await getCourseById(courseId);
            setCourse(courseData);

            // Fetch professors who taught this course
            const professorsData = await getProfessorsByCourseId(courseId);
            setProfessors(professorsData);
        };
        fetchCourseDetails();
    }, [courseId]);

    if (!course) {
        return <p>Loading course details...</p>;
    }

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} min-h-screen`}>
            <div className="container mx-auto mt-6">
                <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
                <p><strong>Rating:</strong> {course.rating}</p>
                <p><strong>Course ID:</strong> {course.id}</p>
                <p>{course.description}</p>

                <h3 className="text-xl font-semibold mt-6">Professors Who Taught This Course:</h3>
                {professors.length === 0 ? (
                    <p>No professors have taught this course yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {professors.map((professor) => (
                            <div key={professor.id} className={`p-4 rounded shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                                <Link to={`/professor/${professor.id}?courseId=${courseId}`} className="text-lg font-bold hover:underline">
                                    {professor.name}
                                </Link>
                                <p>
                                    <strong>Profile:</strong>{" "}
                                    <a
                                        href={professor.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Rate My Professors
                                    </a>
                                </p>
                                <p><strong>Details:</strong> {professor.details || "No details available"}</p>
                                <p><strong>Avg Rating:</strong> {professor.avgRating}</p>
                                <p><strong>Avg Difficulty:</strong> {professor.avgDifficulty}</p>
                                <p><strong>Department:</strong> {professor.department}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDetail;
