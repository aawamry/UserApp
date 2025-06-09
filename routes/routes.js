import express from 'express';
import UserDatabase from '../data/data.js';
import RecruitedUserController from '../controller/controllers.js';
import RecruitedUserModel from '../models/models.js';

class RecruitedUserRoutes {
	constructor() {
		this.router = express.Router();
		this.tableName = 'usersRecruitment';
		this.initRoutes();
	}

	async initRoutes() {
		this.db = await UserDatabase.getInstance('../data/users_database.db');

		this.router.get('/add', (req, res) => {
			res.render('usersform', {
				title: 'Add Recruited User',
				user: {},
				formAction: '/users/add',
				method: 'POST',
				backUrl: req.get('Referer') || '/users'
			});
		});

		this.router.get('/:id/edit', async (req, res) => {
			try {
				const user = await RecruitedUserModel.getByFieldModel('id', req.params.id);
				if (!user || user.length === 0) {
					return res.status(404).send({ error: 'User not found.' });
				}
				res.render('usersform', {
					title: 'Edit Recruited User',
					user: user[0],
					formAction: `/users/${req.params.id}?_method=PUT`,
					method: 'POST',
					backUrl: req.get('Referer') || '/users'
				});
			} catch (error) {
				res.status(500).send('Error loading edit form: ' + error.message);
			}
		});

		this.router.get('/analytics', async (req, res) => {
			try {
				const users = await RecruitedUserModel.getAllModel();

				const totalUsers = users.length;

				const genderCounts = {};
				const departmentCounts = {};
				const cityCounts = {};
				const roleCounts = {};

				for (const user of users) {
					genderCounts[user.gender] = (genderCounts[user.gender] || 0) + 1;
					departmentCounts[user.department] = (departmentCounts[user.department] || 0) + 1;
					cityCounts[user.city] = (cityCounts[user.city] || 0) + 1;
					roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
				}

				res.render('analytics', {
					title: 'Recruitment Data Analytics',
					totalUsers,
					departmentCounts,
					genderCounts,
					cityCounts,
					roleCounts
				});
			} catch (error) {
				console.error('Error generating analytics:', error.message);
				res.status(500).send('Error generating analytics');
			}
		});

		this.router.get('/', RecruitedUserController.listRecruitedUsersController);
		this.router.post('/add', RecruitedUserController.addRecruitedUserController);
		this.router.get('/export', RecruitedUserController.downloadCSVController);
		this.router.get('/:id', RecruitedUserController.viewRecruitedUserController);
		this.router.put('/:id', RecruitedUserController.updateRecruitedUserController);
		this.router.delete('/:id', RecruitedUserController.deleteRecruitedUserController);
	}

	getRouter() {
		return this.router;
	}
}

export default new RecruitedUserRoutes().getRouter();
