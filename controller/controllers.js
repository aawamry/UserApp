import fs from 'fs';
import { createObjectCsvWriter } from 'csv-writer';
import RecruitedUserModel from '../models/models.js';

class RecruitedUserController {
	// 🧾 Controller to list all recruited users or search by field
	async listRecruitedUsersController(req, res) {
		try {
			const { field, value } = req.query; // Get query parameters
			let recruitedUsers = [];

			console.log('📥 listRecruitedUsersController called with:', { field, value });

			if (field && value) {
				// If search field and value provided
				recruitedUsers = await RecruitedUserModel.getByFieldModel(field, value);
				console.log('🔍 Filtered users found:', recruitedUsers.length);
			} else {
				// Return all users
				recruitedUsers = await RecruitedUserModel.getAllModel();
				console.log('📋 Total users found:', recruitedUsers.length);
			}

			res.render('userslist', { recruitedUsers, title: 'Users List' });
		} catch (error) {
			console.error('❌ Error in listRecruitedUsersController:', error.message);
			res.status(500).json({ error: error.message });
		}
	}

	// ➕ Controller to add a recruited user
	async addRecruitedUserController(req, res) {
		try {
			console.log('📥 addRecruitedUserController request body:', req.body);

			const {
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
				personalEmail
			} = req.body;

			// Validate required fields
			if (
				!firstName ||
				!lastName ||
				!role ||
				!department ||
				!educationLevel ||
				!specialization ||
				!address ||
				!region ||
				!city ||
				!nationalId ||
				!socialSecurityNumber
			) {
				console.warn('⚠️ Missing required fields');
				return res.status(400).json({ error: 'Missing required fields.' });
			}

			// Ensure phone is always an array
			const phoneArray = Array.isArray(phone) ? phone : [phone];
			console.log('📞 Phone numbers formatted:', phoneArray);

			const user = await RecruitedUserModel.addRecruitedUserModel(
				firstName,
				middleName,
				lastName,
				role,
				department,
				educationLevel,
				specialization,
				phoneArray,
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

			console.log('✅ New user added:', user?.id);
			res.status(201).redirect('/users');
		} catch (error) {
			console.error('❌ Error in addRecruitedUserController:', error.message);
			res.status(500).json({ error: error.message });
		}
	}

	// 👁️ Controller to view a specific recruited user by ID
	async viewRecruitedUserController(req, res) {
		try {
			const { id } = req.params;
			console.log('👁️ Fetching user with ID:', id);

			const user = await RecruitedUserModel.getByFieldModel('id', id);

			if (!user || user.length === 0) {
				console.warn('⚠️ User not found with ID:', id);
				return res.status(404).json({ error: 'User not found.' });
			}

			res.render('usersview', {
				title: 'Recruited User',
				user: user[0]
			});
		} catch (error) {
			console.error('❌ Error in viewRecruitedUserController:', error.message);
			res.status(500).json({ error: error.message });
		}
	}

	// 🔄 Controller to update user data
	async updateRecruitedUserController(req, res) {
		try {
			const { id } = req.params;
			console.log('📝 Received update request for user ID:', id);

			const {
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
				personalEmail
			} = req.body;

			const phoneArray = Array.isArray(phone) ? phone : [phone];

			console.log('📝 Update fields:', {
				firstName,
				middleName,
				lastName,
				role,
				department,
				educationLevel,
				specialization,
				phoneArray,
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
			});

			const updatedUser = await RecruitedUserModel.updateRecruitedUserModel(
				id,
				firstName,
				middleName,
				lastName,
				role,
				department,
				educationLevel,
				specialization,
				phoneArray,
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

			if (!updatedUser) {
				console.warn(`⚠️ No user found to update with ID: ${id}`);
				return res.status(404).json({ error: 'User not found.' });
			}

			console.log('✅ User updated with ID:', id);
			console.time('response-time');
			res.redirect('/users');
			console.timeEnd('response-time');
		} catch (error) {
			console.error('❌ Error updating user:', error.message);
			res.status(500).send('Error updating user: ' + error.message);
		}
	}

	// ❌ Controller to delete a user
	async deleteRecruitedUserController(req, res) {
		try {
			const { id } = req.params;
			console.log('🗑️ Attempting to delete user with ID:', id);

			const deletedUser = await RecruitedUserModel.deleteRecruitedUserModel(id);

			if (!deletedUser) {
				console.warn('⚠️ User not found for deletion with ID:', id);
				return res.status(404).json({ error: 'User not found.' });
			}

			console.log('✅ User deleted successfully with ID:', id);
			res.status(200).redirect('/users');
		} catch (error) {
			console.error('❌ Error deleting user:', error.message);
			res.status(500).json({ error: error.message });
		}
	}

	async downloadCSVController(req, res) {
		try {
			console.log('📥 Starting CSV export process...');

			// Fetch all recruited users
			const recruitedUsers = await RecruitedUserModel.getAllModel();
			console.log(`📋 Retrieved ${recruitedUsers.length} users from database.`);

			// Check if users exist
			if (!recruitedUsers || recruitedUsers.length === 0) {
				console.log('⚠️ No recruited users found to export.');
				return res.status(404).json({ error: 'No users found to export.' });
			}

			// Ensure exports directory exists
			if (!fs.existsSync('exports')) {
				fs.mkdirSync('exports');
				console.log('📁 "exports" directory created.');
			} else {
				console.log('📁 "exports" directory already exists.');
			}

			// Setup CSV writer
			const csvWriter = createObjectCsvWriter({
				path: 'exports/recruited_users.csv',
				header: [
					{ id: 'id', title: 'ID' },
					{ id: 'firstName', title: 'First Name' },
					{ id: 'middleName', title: 'Middle Name' },
					{ id: 'lastName', title: 'Last Name' },
					{ id: 'role', title: 'Role' },
					{ id: 'department', title: 'Department' },
					{ id: 'educationLevel', title: 'Education Level' },
					{ id: 'specialization', title: 'Specialization' },
					{ id: 'phone', title: 'Phone' },
					{ id: 'address', title: 'Address' },
					{ id: 'region', title: 'Region' },
					{ id: 'city', title: 'City' },
					{ id: 'nationality', title: 'Nationality' },
					{ id: 'dateOfBirth', title: 'Date of Birth' },
					{ id: 'gender', title: 'Gender' },
					{ id: 'maritalStatus', title: 'Marital Status' },
					{ id: 'nationalId', title: 'National ID' },
					{ id: 'socialSecurityNumber', title: 'SSN' },
					{ id: 'militaryServiceStatus', title: 'Military Service' },
					{ id: 'personalEmail', title: 'Email' },
					{ id: 'created_at', title: 'Created At' }
				]
			});

			console.log('📝 Writing records to CSV file...');
			await csvWriter.writeRecords(recruitedUsers);
			console.log('✅ CSV file written successfully at "exports/recruited_users.csv"');

			// Send the CSV file for download
			console.log('📤 Sending CSV file to client...');
			res.download('exports/recruited_users.csv', 'recruited_users.csv', (err) => {
				if (err) {
					console.error('❌ Error sending CSV file:', err.message);
					return res.status(500).send('Error sending CSV file');
				}
				console.log('🚀 CSV file sent successfully.');
			});
		} catch (error) {
			console.error('❌ Error generating CSV:', error.message);
			res.status(500).send('Failed to generate CSV');
		}
	}

	async analyticsController(req, res) {
		try {
			console.log('📊 [AnalyticsController] Called');

			const users = await RecruitedUserModel.getAllModel();
			console.log(`✅ [AnalyticsController] Retrieved ${users.length} users`);

			const departmentCounts = {};
			const genderCounts = {};
			const cityCounts = {};
			const roleCounts = {};

			users.forEach((user) => {
				departmentCounts[user.department] = (departmentCounts[user.department] || 0) + 1;
				genderCounts[user.gender] = (genderCounts[user.gender] || 0) + 1;
				cityCounts[user.city] = (cityCounts[user.city] || 0) + 1;
				roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
			});

			console.log('🧮 Department Counts:', departmentCounts);
			console.log('🧮 Gender Counts:', genderCounts);
			console.log('🧮 City Counts:', cityCounts);
			console.log('🧮 Role Counts:', roleCounts);

			res.render('analytics', {
				title: 'Recruitment Data Analytics',
				totalUsers: users.length,
				departmentCounts,
				genderCounts,
				cityCounts,
				roleCounts
			});
		} catch (error) {
			console.error('❌ [AnalyticsController] Error:', error);
			res.status(500).send('Error loading analytics');
		}
	}
}

export default new RecruitedUserController();
