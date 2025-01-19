import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getCommentsByCourseAndProfessor } from "../services/courseService.js";
import { Rating } from "flowbite-react";

const starIcon = "/resources/gmu.png";
const grayStarIcon = "/resources/gmu_gray.png";
const difficultyIcon = "/resources/fire.png";
const grayDifficultyIcon = "/resources/fire_gray.png";

const ProfessorComments = ({ darkMode }) => {
    const { professorId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get("courseId");

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [professorName, setProfessorName] = useState("Unknown Professor");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getCommentsByCourseAndProfessor(courseId, professorId);

                setProfessorName(data.professorName || "Unknown Professor");
                setComments(data.comments || []);
            } catch (error) {
                console.error("Error fetching comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [professorId, courseId]);

    if (loading) return <p className="text-center mt-4">Loading comments...</p>;

    const renderStars = (rating, icon, grayIcon) => {
        const totalStars = 5;
        return Array.from({ length: totalStars }, (_, index) => (
            <img
                key={index}
                src={index < rating ? icon : grayIcon}
                alt="Icon"
                className="w-12 h-8 mr-2"
            />
        ));
    };

    return (
        <div className="transform scale-60">
        <div
            className={`min-h-screen px-4 py-6 transition-colors duration-500 ${
                darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
            }`}
        >
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">
                    Comments for {professorName} for {comments[0]?.courseName || "Unknown Course"}
                </h2>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div
                            key={index}
                            className={`shadow-md rounded-lg p-4 mb-4 transition-colors duration-500 ${
                                darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
                            }`}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(comment.date).toLocaleDateString()}
                                </span>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Grade: <strong>{comment.grade || "Not Sure"}</strong>
                                </p>
                            </div>
                            
                            <div>
                                <div className="flex items-center mb-2">
                                    <span className="font-semibold mr-2">Quality:</span>
                                    <div className="flex">{renderStars(comment.quality, starIcon, grayStarIcon)}</div>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold mr-2">Difficulty:</span>
                                    <div className="flex">{renderStars(comment.difficulty, difficultyIcon, grayDifficultyIcon)}</div>
                                </div>
                            </div>
                            <p className="mt-4">
                                {comment.comment || "No comment provided"}
                            </p>
                            <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-4">
                                Taught in {comment.courseName || "Unknown Course"} by {professorName}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 p-4 rounded-lg">
                        No comments found for this professor
                        {courseId ? " in this course" : ""}.
                    </div>
                )}
            </div>
        </div>
        </div>
    );
};

export default ProfessorComments;



