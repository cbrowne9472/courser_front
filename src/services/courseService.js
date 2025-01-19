// What it does: Imports the axios library, a popular HTTP client for making requests to APIs.
//     Why it's used: Axios simplifies HTTP requests and provides easy-to-use methods like get, post, put, and delete.
import axios from 'axios';

// Define the base URL for the API

const API_BASE_URL = "http://localhost:8080/home";


// Define the function to get the courses from the API

//Why export?
//
// By adding export, you're making this function part of the module's public API, so other files can import and use it.
// Without export, this function would only be accessible within the same file.

export const getAverageRatingFromCourse = async (courseId) => {
    try {
        const response = await axios.get(`http://localhost:8080/home/course/${courseId}/avg_rating`);
        return response.data; // Returns CourseRatingDTO
    } catch (error) {
        console.error("Error fetching average rating for course:", error);
        return null; // Handle error gracefully
    }
};


export const getAverageGradesByProfessor = async (courseId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/course/${courseId}/professor-grades`);
        return response.data; // List of average grades
    } catch (error) {
        console.error("Error fetching average grades by professor:", error);
        return [];
    }
};


export const getAverageGradeForCourse = async (courseId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/course/${courseId}/average-grade`);
        return response.data; // The average grade as a string
    } catch (error) {
        console.error("Error fetching average grade for course:", error);
        return null; // Return null or a default value
    }
};

export const getCommentsByCourseAndProfessor = async (courseId, professorId) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/prof_api/comments?courseId=${courseId}&professorId=${professorId}`
        );
        return response.data; // List of comments
    } catch (error) {
        console.error("Error fetching comments for course and professor:", error);
        return [];
    }
};

export const getProfessorsByCourseId = async (courseId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/course/${courseId}/professors`);
        return response.data; // List of professors
    } catch (error) {
        console.error("Error fetching professors for course:", error);
        return [];
    }
};

export const getCommentsByProfessorId = async (professorId) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/prof_api/professor/${professorId}/comments`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching comments for professor:", error);
        return [];
    }
};

export const getProfessorRatings = async (professorId) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/prof_api/${professorId}/ratings`
        );
        return response.data; // Returns ProfessorRatingDTO
    } catch (error) {
        console.error("Error fetching professor ratings:", error);
        return null;
    }
};


export const getProfessorDetails = async (professorId) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/prof_api/professor/${professorId}/details`
        );
        return response.data; // Returns an object with "professor" and "comments"
    } catch (error) {
        console.error("Error fetching professor details:", error);
        return { professor: null, comments: [] }; // Default response on error
    }
};

export const searchCoursesAndProfessors = async (query) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/home/search?query=${query}`
        );
        return response.data; // Returns an object with "courses" and "professors"
    } catch (error) {
        console.error("Error searching for courses and professors:", error);
        return { courses: [], professors: [] };
    }
};

export const getCourses = async (start = 0, limit = 10, sortBy = "courseNumber", order = "asc", searchQuery = "", subject = "", level = "") => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/courses?start=${start}&limit=${limit}&sortBy=${sortBy}&order=${order}&searchQuery=${searchQuery}&subject=${subject}&level=${level}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching courses:", error);
        return [];
    }
};


export const getSubjects = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/subjects`);
        return response.data;
    } catch (error) {
        console.error("Error fetching subjects:", error);
        return [];
    }
};

export const searchCourses = async (query) => {
    try {
        const response = await axios.get(
            `http://localhost:8080/home/courses/search?title=${query}`
        );
        return response.data;
    } catch (error) {
        console.error("Error searching courses:", error);
        return [];
    }
};

export const sortCourses = async (sortBy, order, start = 0, limit = 10) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/courses/sort?sortBy=${sortBy}&order=${order}&start=${start}&limit=${limit}`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching sorted courses:", error);
        return [];
    }
};




export const addCourse = async (course) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add`, course);  // Corrected to use backticks
        return response.data;
    } catch (error) {
        console.error("Error adding course:", error);
    }
}

export const getCourseById = async (courseId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get/${courseId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching course:", error);
    }
};

