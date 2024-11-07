import pg from 'pg';
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
//
// const createTable = async () => {
//     const createTableQuery = `
//     CREATE TABLE IF NOT EXISTS users(
//         id SERIAL PRIMARY KEY,
//         first_name VARCHAR(50),
//         last_name VARCHAR(50),
//         college_name VARCHAR(100),
//         university_name VARCHAR(100),
//         university_email VARCHAR(100),
//         enrollment_id VARCHAR(50),
//         college_id BYTEA,
//         city VARCHAR(50),
//         state VARCHAR(50),
//         password VARCHAR(255),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     );
//   `;
//
//     try {
//         await pool.query(createTableQuery);
//         console.log("Users table created successfully or already exists.");
//     } catch (error) {
//         console.error("Error creating table:", error.message || error);
//     }
// };
//
// // Call createTable to ensure the table is created on startup
// createTable();

export default pool;