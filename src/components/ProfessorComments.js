import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Added useLocation for query params
import { getCommentsByCourseAndProfessor } from "../services/courseService.js";
import "bootstrap/dist/css/bootstrap.min.css";

// Update with public folder paths
const starIcon = "/resources/gmu.png";
const grayStarIcon = "/resources/gmu_gray.png";
const difficultyIcon = "/resources/fire.png"; // Difficulty icon
const grayDifficultyIcon = "/resources/fire_gray.png"; // Gray difficulty icon

const ProfessorComments = () => {
    const { professorId } = useParams(); // Get professor ID from URL
    const location = useLocation(); // Get query params
    const queryParams = new URLSearchParams(location.search);
    const courseId = queryParams.get("courseId"); // Get courseId from query params

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [professorName, setProfessorName] = useState("Unknown Professor");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                // Fetch comments by course and professor
                const data = await getCommentsByCourseAndProfessor(courseId, professorId);

                console.log("API Response Data:", data); // Log API response

                // Extract professorName and comments
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

    if (loading) return <p>Loading comments...</p>;

    const renderStars = (rating, icon, grayIcon) => {
        const totalStars = 5;
        return Array.from({ length: totalStars }, (_, index) => (
            <img
                key={index}
                src={index < rating ? icon : grayIcon}
                alt="Icon"
                style={{ width: "40px", marginRight: "8px" }}
            />
        ));
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Comments for {professorName} for {comments[0].courseName}</h2>
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div key={index} className="card mb-3 shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <span className="text-muted small">
                                    {new Date(comment.date).toLocaleDateString()}
                                </span>
                                <div>
                                    <div className="d-flex align-items-center">
                                        <span className="me-2 fw-bold">Quality:</span>
                                        <div className="d-flex">{renderStars(comment.quality, starIcon, grayStarIcon)}</div>
                                    </div>
                                    <div className="d-flex align-items-center mt-1">
                                        <span className="me-2 fw-bold">Difficulty:</span>
                                        <div className="d-flex">{renderStars(comment.difficulty, difficultyIcon, grayDifficultyIcon)}</div>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-2">{comment.comment || "No comment provided"}</p>
                            <p className="text-end text-muted small">
                                Taught in {comment.courseName || "Unknown Course"} by {professorName}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="alert alert-info">No comments found for this professor{courseId ? " in this course" : ""}.</div>
            )}
        </div>
    );
};

export default ProfessorComments;




