import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommentsByProfessorId } from "../services/courseService.js";
import "bootstrap/dist/css/bootstrap.min.css";

// Update with public folder paths
const starIcon = "/resources/gmu.png";
const grayStarIcon = "/resources/gmu_gray.png";
const difficultyIcon = "/resources/fire.png"; // New difficulty icon
const grayDifficultyIcon = "/resources/fire_gray.png"; // New gray difficulty icon

const ProfessorComments = () => {
    const { professorId } = useParams(); // Get professor ID from URL
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [professorName, setProfessorName] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getCommentsByProfessorId(professorId);
                const sortedComments = (data.comments || []).sort(
                    (a, b) => new Date(b.date) - new Date(a.date) // Newest to oldest
                );
                setComments(sortedComments);
                setProfessorName(data.professorName || "Unknown Professor");
            } catch (error) {
                console.error("Error fetching professor comments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [professorId]);

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
            <h2 className="mb-4">Comments for {professorName}</h2>
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
                            <p className="mt-2">{comment.comment}</p>
                            <p className="text-end text-muted small">
                                Taught by {professorName}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="alert alert-info">No comments found for this professor.</div>
            )}
        </div>
    );
};

export default ProfessorComments;




