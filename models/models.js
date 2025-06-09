import UserDatabase from '../data/data.js';
import {
	getAllQuery,
	getByFieldQuery,
	insertRecruitedUserQuery,
	updateRecruitedUserQuery,
	deleteUserQuery
} from '../data/queries.js';

class RecruitedUserModel {
	constructor(
		id,
		firstName,
		middleName,
		lastName,
		role,
		department,
		educationLevel,
		specialization,
		phone,
		address,
		region,
		city,
		nationality,
		dateOfBirth,
		gender,
		maritalStatus,
		nationalId,
		socialSecurityNumber,
		militaryServiceStatus,
		personalEmail,
		created_at
	) {
		this.id = id;
		this.firstName = firstName;
		this.middleName = middleName;
		this.lastName = lastName;
		this.role = role;
		this.department = department;
		this.educationLevel = educationLevel;
		this.specialization = specialization;
		this.phone = phone;
		this.address = address;
		this.region = region;
		this.city = city;
		this.nationality = nationality;
		this.dateOfBirth = dateOfBirth;
		this.gender = gender;
		this.maritalStatus = maritalStatus;
		this.nationalId = nationalId;
		this.socialSecurityNumber = socialSecurityNumber;
		this.militaryServiceStatus = militaryServiceStatus;
		this.personalEmail = personalEmail;
		this.created_at = created_at;
	}
	static async getAllModel() {
		console.log('📥 getAllModel called');
		const dbInstance = await UserDatabase.getInstance(); // Get database instance
		console.log('✅ Database instance acquired');

		const recruitedUsers = await dbInstance.db.all(getAllQuery('usersRecruitment')); // Fetch all users
		console.log('📄 Retrieved users from DB:', recruitedUsers.length);

		// Map raw DB rows to model instances
		return recruitedUsers.map(
			(user) =>
				new RecruitedUserModel(
					user.id,
					user.firstName,
					user.middleName,
					user.lastName,
					user.role,
					user.department,
					user.educationLevel,
					user.specialization,
					user.phone,
					user.address,
					user.region,
					user.city,
					user.nationality,
					user.dateOfBirth,
					user.gender,
					user.maritalStatus,
					user.nationalId,
					user.socialSecurityNumber,
					user.militaryServiceStatus,
					user.personalEmail,
					user.created_at
				)
		);
	}

	static async getByFieldModel(field, value) {
		console.log(`🔍 getByFieldModel called with field: ${field}, value: ${value}`);
		const dbInstance = await UserDatabase.getInstance(); // Get database instance
		console.log('✅ Database instance acquired');

		const allowedFields = [
			'id',
			'firstName',
			'lastName',
			'role',
			'department',
			'educationLevel',
			'specialization',
			'phone',
			'region',
			'city',
			'dateOfBirth',
			'gender',
			'maritalStatus',
			'nationalId',
			'socialSecurityNumber',
			'militaryServiceStatus',
			'personalEmail'
		];

		if (!allowedFields.includes(field)) {
			console.error(`❌ Field ${field} is not allowed for searching.`);
			throw new Error(`Field ${field} is not allowed for searching.`);
		}

		const recruitedUsers = await dbInstance.db.all(getByFieldQuery('usersRecruitment', field), [`%${value}%`]); // Fetch users by field
		console.log('📄 Retrieved matching users:', recruitedUsers.length);

		return recruitedUsers.map(
			(user) =>
				new RecruitedUserModel(
					user.id,
					user.firstName,
					user.middleName,
					user.lastName,
					user.role,
					user.department,
					user.educationLevel,
					user.specialization,
					user.phone,
					user.address,
					user.region,
					user.city,
					user.nationality,
					user.dateOfBirth,
					user.gender,
					user.maritalStatus,
					user.nationalId,
					user.socialSecurityNumber,
					user.militaryServiceStatus,
					user.personalEmail,
					user.created_at
				)
		);
	}

	static async addRecruitedUserModel(
		firstName,
		middleName,
		lastName,
		role,
		department,
		educationLevel,
		specialization,
		phone = [],
		address,
		region,
		city,
		nationality,
		dateOfBirth,
		gender,
		maritalStatus,
		nationalId,
		socialSecurityNumber,
		militaryServiceStatus,
		personalEmail,
		created_at
	) {
		console.log('➕ addRecruitedUserModel called with:', {
			firstName,
			lastName,
			role,
			phone,
			city,
			nationalId
		});

		const dbInstance = await UserDatabase.getInstance(); // Get database instance
		console.log('✅ Database instance acquired');

		const phoneString = Array.isArray(phone) ? phone.join(',') : phone;

		const result = await dbInstance.db.run(insertRecruitedUserQuery('usersRecruitment'), [
			firstName,
			middleName,
			lastName,
			role,
			department,
			educationLevel,
			specialization,
			phoneString,
			address,
			region,
			city,
			nationality,
			dateOfBirth,
			gender,
			maritalStatus,
			nationalId,
			socialSecurityNumber,
			militaryServiceStatus,
			personalEmail,
			created_at
		]);

		console.log('📤 Insert result:', result);

		if (result.changes > 0) {
			console.log('✅ User added with ID:', result.lastID);
			return new RecruitedUserModel(
				result.lastID,
				firstName,
				middleName,
				lastName,
				role,
				department,
				educationLevel,
				specialization,
				phoneString,
				address,
				region,
				city,
				nationality,
				dateOfBirth,
				gender,
				maritalStatus,
				nationalId,
				socialSecurityNumber,
				militaryServiceStatus,
				personalEmail,
				created_at
			);
		} else {
			console.warn('⚠️ No user was added.');
			return null;
		}
	}

	static async updateRecruitedUserModel(
		id,
		firstName,
		middleName,
		lastName,
		role,
		department,
		educationLevel,
		specialization,
		phone = [],
		address = '',
		region = '',
		city,
		nationality,
		dateOfBirth,
		gender,
		maritalStatus,
		nationalId,
		socialSecurityNumber,
		militaryServiceStatus,
		personalEmail
	) {
		const dbInstance = await UserDatabase.getInstance();
		const phoneArray = Array.isArray(phone) ? phone : [phone];
		const phoneString = phoneArray.join(',');

		console.log('🔄 Updating user in DB with ID:', id);
		console.log('🔄 Update parameters:', [
			firstName,
			middleName,
			lastName,
			role,
			department,
			educationLevel,
			specialization,
			phoneString,
			address,
			region,
			city,
			nationality,
			dateOfBirth,
			gender,
			maritalStatus,
			nationalId,
			socialSecurityNumber,
			militaryServiceStatus,
			personalEmail,
			id
		]);

		try {
			const result = await dbInstance.db.run(updateRecruitedUserQuery('usersRecruitment'), [
				firstName,
				middleName,
				lastName,
				role,
				department,
				educationLevel,
				specialization,
				phoneString,
				address,
				region,
				city,
				nationality,
				dateOfBirth,
				gender,
				maritalStatus,
				nationalId,
				socialSecurityNumber,
				militaryServiceStatus,
				personalEmail,
				id
			]);

			console.log('🔄 DB update completed:', result);

			// Note: depending on sqlite3 version, 'changes' may be on result or this.changes in callback
			// If changes property is missing, you may need to confirm your sqlite3 version or wrapper

			if (result.changes && result.changes > 0) {
				return new RecruitedUserModel(
					firstName,
					middleName,
					lastName,
					role,
					department,
					educationLevel,
					specialization,
					phoneString,
					address,
					region,
					city,
					nationality,
					dateOfBirth,
					gender,
					maritalStatus,
					nationalId,
					socialSecurityNumber,
					militaryServiceStatus,
					personalEmail
				);
			}
		} catch (error) {
			console.error('Error updating recruited user:', error);
			throw error;
		}

		return null;
	}

	static async deleteRecruitedUserModel(id) {
		const dbInstance = await UserDatabase.getInstance(); // Get database instance
		await dbInstance.db.run(deleteUserQuery('usersRecruitment'), [id]); // Delete user by ID
		return { message: `User ${id} Deleted Successfully` };
	}
}

export default RecruitedUserModel;
// This code defines a RecruitedUserModel class that interacts with a user recruitment database.
// It provides methods to get all users, get users by a specific field, add a new user, update an existing user, and delete a user.
// The class uses a singleton pattern to ensure only one instance of the database connection is used.
// The methods return instances of RecruitedUserModel, which encapsulate user data and provide a structured way to interact with the database.
