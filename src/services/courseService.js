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


export const getCourses = async (start = 0, limit = 10, sortBy = "courseNumber", order = "asc", searchQuery = "", subject = "") => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/courses?start=${start}&limit=${limit}&sortBy=${sortBy}&order=${order}&searchQuery=${searchQuery}&subject=${subject}`
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

