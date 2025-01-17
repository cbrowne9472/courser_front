import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCourseById, getProfessorsByCourseId } from "../services/courseService.js";
import { Link } from "react-router-dom";

const tagIcon = "/resources/tag.png";

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
        <div
            className={`min-h-screen transition-colors duration-500 ${
                darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
            }`}
        >
            <div className="container mx-auto mt-6">
                {/* Course Details Section */}
                <div className="mb-6 transition-colors duration-150">
                    <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
                    <p><strong>Rating:</strong> {course.rating}</p>
                    <p><strong>Course ID:</strong> {course.id}</p>
                    <p>{course.description}</p>
                    <p>{course.additionalInfo}</p>
                </div>

                {/* Main Content Section: Table and Additional Info */}
                <div className="flex mt-6">
                    {/* Left Section: Table */}
                    <div className="w-2/3 pr-4">
                        <h3 className="text-xl font-semibold mb-4">Professors Who Taught This Course:</h3>
                        {professors.length === 0 ? (
                            <p>No professors have taught this course yet.</p>
                        ) : (
                            <table
                                className={`table-auto w-full mt-4 transition-colors duration-150 ${
                                    darkMode ? "text-white" : "text-black"
                                }`}
                            >
                                <thead>
                                <tr
                                    className={`transition-colors duration-500 ${
                                        darkMode ? "bg-gray-800" : "bg-gray-300"
                                    }`}
                                >
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Avg Rating</th>
                                    <th className="px-4 py-2">Avg Difficulty</th>
                                    <th className="px-4 py-2">Profile</th>
                                </tr>
                                </thead>
                                <tbody>
                                {professors.map((professor, index) => (
                                    <tr
                                        key={professor.id}
                                        className={`transition-colors duration-500 ${
                                            index % 2 === 0
                                                ? darkMode
                                                    ? "bg-gray-700"
                                                    : "bg-gray-100"
                                                : ""
                                        }`}
                                    >
                                        <td className="px-4 py-2">
                                            <Link
                                                to={`/professor/${professor.id}?courseId=${courseId}`}
                                                className="hover:underline flex items-center"
                                            >
                                                {professor.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-2">{professor.avgRating}</td>
                                        <td className="px-4 py-2">{professor.avgDifficulty}</td>
                                        <td className="px-4 py-2">
                                            <a
                                                href={professor.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="ml-2"
                                            >
                                                <img
                                                    src={tagIcon}
                                                    alt="Rate My Professors"
                                                    className="inline-block h-5 w-5"
                                                />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Right Section: Additional Info Box */}
                    <div className="w-1/3 pl-4">
                        <div
                            className={`p-4 rounded shadow-md transition-colors duration-500 ${
                                darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"
                            }`}
                        >
                            <h3 className="text-xl font-semibold">Additional Information</h3>
                            <p>
                                Here you can add content for the right side of the page, such as notes, related links, or
                                other components. This box is independent of the table and main content.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;




