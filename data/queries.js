export const createUserRecruitmentTable = () => `CREATE TABLE IF NOT EXISTS usersRecruitment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT NOT NULL,
    middleName TEXT,
    lastName TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    educationLevel TEXT NOT NULL,
    specialization TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    address TEXT,
    region TEXT,
    city TEXT,
    nationality TEXT,
    dateOfBirth TEXT,
    gender TEXT,
    maritalStatus TEXT,
    nationalId TEXT NOT NULL UNIQUE,
    socialSecurityNumber TEXT UNIQUE,
    militaryServiceStatus TEXT,
    personalEmail TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP) NOT NULL
)`;
export const getAllQuery = (table) => `SELECT * FROM ${table}`;
export const getByFieldQuery = (table, field) => `SELECT * FROM ${table} WHERE ${field} LIKE ?`;
export const insertRecruitedUserQuery = (table) =>
	`INSERT INTO ${table} (firstName, middleName, lastName, role, department, educationLevel, specialization, phone, address, region, city, nationality, dateOfBirth, gender, maritalStatus, nationalId, socialSecurityNumber, militaryServiceStatus, personalEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
export const updateRecruitedUserQuery = (table) =>
	`UPDATE ${table} SET firstName = ?, middleName = ?, lastName = ?, role = ?, department = ?, educationLevel = ?, specialization = ?, phone = ?, address = ?, region = ?, city = ?, nationality = ?, dateOfBirth = ?, gender = ?, maritalStatus = ?, nationalId = ?, socialSecurityNumber = ?, militaryServiceStatus = ?, personalEmail = ? WHERE id = ?`;
export const deleteUserQuery = (table) => `DELETE FROM ${table} WHERE id = ?`;
