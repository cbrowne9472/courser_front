import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    getCourseById,
    getProfessorsByCourseId,
    getAverageGradeForCourse,
    getAverageGradesByProfessor,
    getAverageRatingFromCourse,
    getCommentsByCourseAndProfessor
} from "../services/courseService.js";
import { Link } from "react-router-dom";
import { Rating } from "flowbite-react";
import Chart from "chart.js/auto";
import { BarChart } from "./BarGraph.js";
import { Progress } from "flowbite-react";
import Select from "react-select";
import makeAnimated from "react-select/animated";


const animatedComponents = makeAnimated();

const COMMENTS_PER_PAGE = 5;

// Import both icons
const tagIconLight = "/resources/tag.png";
const tagIconDark = "/resources/black_tag.png";

const CourseDetail = ({ darkMode }) => {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [professors, setProfessors] = useState([]);
    const [sortedProfessors, setSortedProfessors] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
    const [averageGrade, setAverageGrade] = useState(null);
    const [averageRating, setAverageRating] = useState(null);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [professorName, setProfessorName] = useState("Unknown Professor");

    useEffect(() => {
        const fetchCourseDetails = async () => {
            const courseData = await getCourseById(courseId);
            setCourse(courseData);
            
            console.log(courseData);

            const professorsData = await getProfessorsByCourseId(courseId);
            const averageGrades = await getAverageGradesByProfessor(courseId);

            const mergedData = professorsData.map((professor) => {
                const grade = averageGrades.find((item) => item.professorName === professor.name);
                return { ...professor, avgGrade: grade ? grade.averageGrade : "N/A" };
            });

            setProfessors(mergedData);
            setSortedProfessors(mergedData);

            const averageGradeData = await getAverageGradeForCourse(courseId);
            setAverageGrade(averageGradeData);

            const ratingData = await getAverageRatingFromCourse(courseId);
            setAverageRating(ratingData);
        };
        fetchCourseDetails();
    }, [courseId]);

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });

        const sorted = [...professors].sort((a, b) => {
            if (direction === "asc") {
                return a[key] > b[key] ? 1 : -1;
            } else {
                return a[key] < b[key] ? 1 : -1;
            }
        });
        setSortedProfessors(sorted);
    };

    const fetchCommentsForProfessor = async (professorId) => {
        setLoadingComments(true);
        const response = await getCommentsByCourseAndProfessor(courseId, professorId);

        console.log(response)
        setProfessorName(response.professorName || "Unknown Professor");
        setComments(response.comments || []);
        setSelectedProfessor(professorId);
        setCurrentPage(1); // Reset to first page when a new professor is selected
        setLoadingComments(false);
    };

    const handleProfessorChange = (event) => {
        const professorId = event.target.value;
        fetchCommentsForProfessor(professorId);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Calculate the comments to display for the current page
    const indexOfLastComment = currentPage * COMMENTS_PER_PAGE;
    const indexOfFirstComment = indexOfLastComment - COMMENTS_PER_PAGE;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    // Calculate total pages
    const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);

    if (!course) {
        return <p>Loading course details...</p>;
    }

    return (
        <div className="transform scale-90">

            <div
                className={`min-h-screen pb-20 transition-colors duration-500 ${
                    darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
                }`}
            >

            <div className="container mx-auto mt-6">
                {/* Course Information Card */}
                <div className="flex">
                    <div
                        className={`w-2/3 p-6 mb-6 rounded shadow-md ${
                            darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
                        }`}
                    >
                        <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
                        {/*<p className="mb-2"><strong>Rating:</strong> {course.rating}</p>*/}
                        {/*<p className="mb-2"><strong>Course ID:</strong> {course.id}</p>*/}
                        <p className="mb-2">{course.description}</p>
                        <p>{course.additionalInfo}</p>
                    </div>

                    {/* Chart Section */}
                    <div className="w-1/3 pl-4">
                        {/* Custom Progress Bar */}
                        {averageRating ? (
                            <div className="flex flex-col items-start mb-4">
                                <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke={darkMode ? "red" : "black"}
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 12h14M12 5l7 7-7 7"
                                        ></path>
                                    </svg>
                                    RATING
                                </div>
                                <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                    <div
                                        className="absolute top-0 left-0 h-4 rounded-full"
                                        style={{
                                            width: `${(averageRating.avgRating / 5) * 100}%`,
                                            backgroundColor: darkMode ? "rgba(255, 69, 58, 1)" : "rgba(54, 162, 235, 1)",
                                        }}
                                    ></div>
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-bold text-white dark:text-gray-900">
                                        {averageRating.avgRating.toFixed(2)}/5
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>Loading average rating...</p>
                        )}

                        {averageRating ? (
                            <BarChart ratingData={averageRating} darkMode={darkMode} />
                        ) : (
                            <p>Loading chart...</p>
                        )}

                        {averageRating ? (
                            <>
                                {/* Custom Progress Bar for Difficulty */}
                                <div className="flex flex-col items-start mb-4 mt-4">
                                    <div className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2 flex items-center">
                                        <svg
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            stroke={darkMode ? "orange" : "black"}
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 12h14M12 5l7 7-7 7"
                                            ></path>
                                        </svg>
                                        DIFFICULTY
                                    </div>
                                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                        <div
                                            className="absolute top-0 left-0 h-4 rounded-full"
                                            style={{
                                                width: `${(averageRating.avgDifficulty / 5) * 100}%`,
                                                backgroundColor: darkMode ? "rgba(255, 165, 0, 1)" : "rgba(255, 99, 132, 1)",
                                            }}
                                        ></div>
                                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-bold text-white dark:text-gray-900">
                                            {averageRating.avgDifficulty.toFixed(2)}/5
                                        </div>
                                    </div>
                                </div>
                                <BarChart
                                    ratingData={{
                                        ratings: averageRating.difficultyCounts,
                                    }}
                                    darkMode={darkMode}
                                />
                            </>
                        ) : (
                            <p>Loading difficulty chart...</p>
                        )}
                    </div>
                </div>

                <div className="flex mt-6">
                    <div className="w-2/3 pr-4">
                        <h3 className="text-xl font-semibold mb-4">Professors Who Taught This Course:</h3>
                        {sortedProfessors.length === 0 ? (
                            <p>No professors have taught this course yet.</p>
                        ) : (
                            <div className="max-h-80 overflow-y-auto border border-gray-300 rounded">
                                <table
                                    className={`table-auto w-full mt-4 ${
                                        darkMode ? "text-white" : "text-black"
                                    }`}
                                >
                                    <thead>
                                    <tr className={`${darkMode ? "bg-gray-800" : "bg-gray-300"}`}>
                                        <th className="px-4 py-2">Name</th>
                                        <th
                                            className="px-4 py-2 cursor-pointer hover:text-blue-500"
                                            onClick={() => handleSort("avgRating")}
                                        >
                                            Avg Rating {sortConfig.key === "avgRating" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                        </th>
                                        <th
                                            className="px-4 py-2 cursor-pointer hover:text-blue-500"
                                            onClick={() => handleSort("avgDifficulty")}
                                        >
                                            Avg Difficulty {sortConfig.key === "avgDifficulty" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                        </th>
                                        <th className="px-4 py-2">Profile</th>
                                        <th className="px-4 py-2">Avg Grade</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {sortedProfessors.map((professor, index) => (
                                        <tr
                                            key={professor.id}
                                            className={index % 2 === 0 ? (darkMode ? "bg-gray-700" : "bg-gray-100") : ""}
                                        >
                                            <td className="px-4 py-2">
                                                {/*<Link*/}
                                                {/*    to={`/professor/${professor.id}?courseId=${courseId}`}*/}
                                                {/*    className="hover:text-blue-500 flex items-center"*/}
                                                {/*>*/}
                                                    {professor.name}
                                                {/*</Link>*/}
                                            </td>
                                            <td className="px-4 py-2">
                                                <Rating>
                                                    <Rating.Star />
                                                    <p
                                                        className={`ml-2 text-sm font-bold transition-colors duration-500 ${
                                                            darkMode ? "text-white" : "text-gray-900"
                                                        }`}
                                                    >
                                                        {professor.avgRating}
                                                    </p>
                                                </Rating>
                                            </td>
                                            <td className="px-4 py-2">{professor.avgDifficulty}</td>
                                            <td className="px-4 py-2">
                                                <a
                                                    href={professor.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <img
                                                        src={darkMode ? tagIconLight : tagIconDark }
                                                        alt="Profile"
                                                        className="inline-block h-5 w-5"
                                                    />
                                                </a>
                                            </td>
                                            <td className="px-4 py-2">{professor.avgGrade}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Comments Section */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">Comments</h3>

                            {/* Dropdown to select professor */}
                            <Select
                                components={animatedComponents}
                                options={professors.map((professor) => ({
                                    value: professor.id,
                                    label: professor.name,
                                }))}
                                onChange={(selectedOption) => fetchCommentsForProfessor(selectedOption?.value || "")}
                                isClearable
                                placeholder="Select a Professor"
                                className="mb-4"
                                menuPlacement="top"
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
                                        marginBottom: "20px",
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
                            {/* Comments for the selected professor */}
                            {loadingComments ? (
                                <p>Loading comments...</p>
                            ) : currentComments.length > 0 ? (
                                currentComments.map((comment, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 rounded shadow-md mb-4 ${
                                            darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
                                        }`}
                                    >
                                        {/* Date and Course Information */}
                                        <div className="flex justify-between text-sm text-gray-500">
                                            <p>{new Date(comment.date).toLocaleDateString()}</p>
                                            <p className="text-right">
                                                Taught in {comment.courseName || "Unknown Course"} by {professorName || "Unknown Professor"}
                                            </p>
                                        </div>

                                        {/* Comment Content */}
                                        <p className="mt-2">{comment.comment}</p>

                                        {/* Quality Section */}
                                        <div className="flex items-center mt-2">
                                            <span className="font-semibold mr-2">Quality:</span>
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>{i < comment.quality ? "⭐" : "☆"}</span>
                                            ))}
                                        </div>

                                        {/* Difficulty and Grade Section */}
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center">
                                                <span className="font-semibold mr-2">Difficulty:</span>
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>{i < comment.difficulty ? "🔥" : "❄"}</span>
                                                ))}
                                            </div>
                                            <span className="font-semibold">Grade: {comment.grade || "Not Sure"}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No comments available for the selected professor.</p>
                            )}


                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-4 mb-8">
                                    {Array.from({ length: totalPages }, (_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`px-4 py-2 mx-1 rounded ${
                                                currentPage === i + 1
                                                    ? darkMode
                                                        ? "bg-gray-700 text-white"
                                                        : "bg-blue-500 text-white"
                                                    : darkMode
                                                        ? "bg-gray-800 text-gray-400"
                                                        : "bg-gray-200 text-gray-600"
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-1/3 pl-4">
                        <div className={`p-4 rounded shadow-md ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
                            <h3 className="text-xl font-semibold">Additional Information</h3>
                            {averageGrade ? (
                                <p>
                                    <strong>Average Grade for {course.courseName}:</strong> {averageGrade}
                                </p>
                            ) : (
                                <p>Loading average grade...</p>
                            )}
                            {/*<p>*/}
                            {/*    Add any additional course-related content here.*/}
                            {/*</p>*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

export default CourseDetail;

