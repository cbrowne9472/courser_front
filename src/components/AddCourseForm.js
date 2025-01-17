import React, { useState } from "react";
import { addCourse } from "../services/courseService.js"; // Import addCourse function

const AddCourseForm = ({ onCourseAdded }) => {
    const [courseName, setCourseName] = useState("");
    const [rating, setRating] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a new course object
        const newCourse = {
            name: courseName,
            rating: parseFloat(rating),
            description: description,
        };

        // Send POST request to add the course
        try {
            await addCourse(newCourse);
            onCourseAdded();  // Call parent method to refresh the course list
            setCourseName(""); // Reset the form
            setRating("");     // Reset the form
            setDescription(""); // Reset
        } catch (error) {
            console.error("Error adding course:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Add New Course</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="courseName" className="form-label">
                        Course Name:
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="courseName"
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">
                        Rating:
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                        Description:
                    </label>
                    <textarea
                        className="form-control"
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Add Course
                </button>
            </form>
        </div>
    );
};

export default AddCourseForm;
