import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProfessorDetails, getProfessorRatings } from "../services/courseService.js";
import { BarChart } from "./BarGraph.js";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const animatedComponents = makeAnimated();

const COMMENTS_PER_PAGE = 5;

const ProfessorDetails = ({ darkMode }) => {
    const { professorId } = useParams();
    const [professor, setProfessor] = useState(null);
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCourse, setSelectedCourse] = useState("All");
    const [professorRatings, setProfessorRatings] = useState(null);

    useEffect(() => {
        const fetchProfessorDetails = async () => {
            setLoadingComments(true);
            const data = await getProfessorDetails(professorId);
            
            console.log(data);
            setProfessor(data.professor);
            setComments(data.comments || []);
            setFilteredComments(data.comments || []);
            setLoadingComments(false);
        };

        const fetchRatings = async () => {
            const ratings = await getProfessorRatings(professorId);
            setProfessorRatings(ratings);
        };

        fetchRatings();
        fetchProfessorDetails();
    }, [professorId]);

    useEffect(() => {
        if (selectedCourse === "All") {
            setFilteredComments(comments);
        } else {
            setFilteredComments(
                comments.filter((comment) => comment.courseName === selectedCourse)
            );
        }
        setCurrentPage(1);
    }, [selectedCourse, comments]);

    const indexOfLastComment = currentPage * COMMENTS_PER_PAGE;
    const indexOfFirstComment = indexOfLastComment - COMMENTS_PER_PAGE;
    const currentComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(filteredComments.length / COMMENTS_PER_PAGE);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (!professor) {
        return <p>Loading...</p>;
    }

    return (
        <div className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
            <div className={`max-w-6xl mx-auto rounded-lg shadow-md p-4 flex justify-between items-center ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"}`}>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{professor.name}</h1>
                    <p className="mb-2">
                        <a href={professor.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                            RateMyProfessor Profile
                        </a>
                    </p>
                    <p className="mb-2 text-sm">Teaches or has taught:</p>
                    <p className="mb-2 text-sm">{professor.courseNames.join(", ")}</p>
                    <p className="text-xs text-gray-400">{comments.length} review(s)</p>
                </div>
                <div className="flex justify-between items-center space-x-6">
                    <div className="flex-1">
                        <div className="text-gray-500 text-sm font-medium mb-2 text-center">RATING</div>
                        <div className="relative w-full bg-gray-700 rounded-full h-4 mb-2">
                            <div
                                className="absolute top-0 left-0 h-4 rounded-full"
                                style={{
                                    width: `${(professorRatings.avgRating / 5) * 100}%`,
                                    backgroundColor: "rgba(255, 69, 58, 1)",
                                }}
                            ></div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-300">
                                {professorRatings.avgRating.toFixed(2)}/5
                            </div>
                        </div>
                        <div className="h-32">
                            <BarChart ratingData={professorRatings} darkMode={darkMode} />
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="text-gray-500 text-sm font-medium mb-2 text-center">DIFFICULTY</div>
                        <div className="relative w-full bg-gray-700 rounded-full h-4 mb-2">
                            <div
                                className="absolute top-0 left-0 h-4 rounded-full"
                                style={{
                                    width: `${(professorRatings.avgDifficulty / 5) * 100}%`,
                                    backgroundColor: "rgba(255, 165, 0, 1)",
                                }}
                            ></div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-300">
                                {professorRatings.avgDifficulty.toFixed(2)}/5
                            </div>
                        </div>
                        <div className="h-32">
                            <BarChart ratingData={{ ratings: professorRatings.difficultyCounts }} darkMode={darkMode} />
                        </div>
                    </div>
                </div>

            </div>
            <div className={`p-4 mt-4 ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"} rounded-lg shadow-md`}>
                <h2 className="text-lg font-semibold mb-2">Comments</h2>
                <div className="mb-2" style={{ maxWidth: "300px" }}>
                    <label htmlFor="filterCourse" className="mr-2 font-medium text-sm">
                        Filter by Course:
                    </label>
                    <Select
                        components={animatedComponents}
                        options={[
                            { value: "All", label: "All" },
                            ...professor.courseNames.map((course) => ({
                                value: course,
                                label: course,
                            })),
                        ]}
                        onChange={(selectedOption) =>
                            setSelectedCourse(selectedOption ? selectedOption.value : "All")
                        }
                        className="mb-4"
                        styles={{
                            control: (base) => ({
                                ...base,
                                background: darkMode ? "#374151" : "#ffffff",
                                color: darkMode ? "#ffffff" : "#000000",
                                borderColor: darkMode ? "#4b5563" : "#d1d5db",
                                transition: "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease",
                                maxWidth: "300px", // Ensures the dropdown doesn't exceed 300px
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
                </div>

                {loadingComments ? (
                    <p>Loading comments...</p>
                ) : currentComments.length > 0 ? (
                    currentComments.map((comment, index) => (
                        <div key={index} className={`p-3 rounded shadow-md mb-3 ${darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"}`}>
                            <div className="flex justify-between mb-1 text-xs">
                                <p>{new Date(comment.date).toLocaleDateString()}</p>
                                <p className="font-medium">
                                    Taught in {comment.courseName} by {professor.name || "Unknown"}
                                </p>
                            </div>
                            <p className="mb-1 text-sm">{comment.comment}</p>
                            <div className="flex justify-between items-center mt-1">
                                <div>
                                    <span className="font-semibold text-sm">Quality: </span>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < comment.quality ? "⭐" : "☆"}</span>
                                    ))}
                                </div>
                                <div>
                                    <span className="font-semibold text-sm">Difficulty: </span>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < comment.difficulty ? "🔥" : "❄"}</span>
                                    ))}
                                </div>
                                <div>
                                    <span className="font-semibold text-sm">Grade: </span>
                                    {comment.grade || "N/A"}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No comments available for this professor.</p>
                )}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-2">
                        <nav className="flex items-center space-x-1">
                            {currentPage > 1 && (
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className={`px-2 py-1 border rounded-full ${
                                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-black"
                                    }`}
                                >
                                    &lt;
                                </button>
                            )}
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    className={`px-2 py-1 border rounded-full ${
                                        currentPage === i + 1
                                            ? darkMode
                                                ? "bg-gray-800 text-white"
                                                : "bg-gray-500 text-white"
                                            : darkMode
                                                ? "bg-gray-700 text-gray-300"
                                                : "bg-gray-300 text-black"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            {totalPages > 5 && (
                                <span className="px-2 py-1 border rounded-full bg-gray-800 text-gray-400">...</span>
                            )}
                            {currentPage < totalPages && (
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className={`px-2 py-1 border rounded-full ${
                                        darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-300 text-black"
                                    }`}
                                >
                                    &gt;
                                </button>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfessorDetails;





