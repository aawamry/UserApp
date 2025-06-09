import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createUserRecruitmentTable } from './queries.js';

class UserDatabase {
	constructor() {
		this.db = null;
		this.dbPath = this.getDBPath(); // Set database file path
		console.log('🔧 Constructor: DB Path set to', this.dbPath);
	}

	// -------------------------- Get Absolute DB Path --------------------------
	getDBPath() {
		const __filename = fileURLToPath(import.meta.url);
		const __dirname = path.dirname(__filename);
		const fullPath = path.join(__dirname, 'users_database.db');
		console.log('📁 Resolved DB file path:', fullPath);
		return fullPath;
	}

	// -------------------------- Initialize Database Connection --------------------------
	async init() {
		if (!this.db) {
			sqlite3.verbose(); // Enable verbose logging
			console.log('🔌 Initializing DB connection...');
			this.db = await open({
				filename: this.dbPath,
				driver: sqlite3.Database
			});
			console.log('✅ DB connection established');
		}
	}

	// -------------------------- Create Table if Not Exists --------------------------
	async createTable() {
		const db = await UserDatabase.getInstance();
		console.log('🧱 Attempting to create User Recruitment table...');
		await this.db.run(createUserRecruitmentTable());
		console.log('✅ User Recruitment table created or already exists.');
	}

	// -------------------------- Get Singleton DB Instance --------------------------
	static async getInstance() {
		if (!this.instance) {
			console.log('🆕 Creating new UserDatabase instance...');
			this.instance = new UserDatabase();
			await this.instance.init();
			await this.instance.createTable();
			console.log('📦 DB instance is ready for use.');
		} else {
			console.log('📦 Using existing DB instance.');
		}
		return this.instance;
	}
}

// -------------------------- Export Singleton DB Instance --------------------------
export default UserDatabase;
