const UserController = require("../controllers/UserController");

class UserApi {
	_validateId(id) {
		if (!id || isNaN(Number(id))) {
			throw new Error("Valid ID is required");
		}
		return Number(id);
	}

	_validateEmail(email) {
		if (!email || typeof email !== 'string') {
			throw new Error("Valid email is required");
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email.trim())) {
			throw new Error("Valid email format is required");
		}

		return email.trim().toLowerCase();
	}

	_validatePassword(password) {
		if (!password || typeof password !== 'string' || password.length < 6) {
			throw new Error("Password must be at least 6 characters long");
		}
		return password;
	}

	_validateName(name) {
		if (!name || typeof name !== 'string' || name.trim().length === 0) {
			throw new Error("Valid name is required");
		}
		return name.trim();
	}

	_validateRole(role) {
		const validRoles = ['admin', 'viewer', 'salesperson'];
		if (role && !validRoles.includes(role)) {
			throw new Error("Valid role is required (admin, viewer, or salesperson)");
		}
		return role;
	}

	_validateCommission(commission) {
		if (commission !== null && commission !== undefined) {
			if (isNaN(Number(commission)) || Number(commission) < 0 || Number(commission) > 100) {
				throw new Error("Commission must be a number between 0 and 100");
			}
			return Number(commission);
		}
		return null;
	}

	_validateUserData(data, requirePassword = true) {
		const { name, email, password, role, commission } = data;

		const validatedData = {
			name: this._validateName(name),
			email: this._validateEmail(email)
		};

		if (requirePassword) {
			validatedData.password = this._validatePassword(password);
		} else if (password) {
			validatedData.password = this._validatePassword(password);
		}

		if (role) {
			validatedData.role = this._validateRole(role);
		}

		if (commission !== undefined) {
			validatedData.commission = this._validateCommission(commission);
		}

		return validatedData;
	}

	_handleError(res, error, defaultMessage = "Internal server error") {
		console.error(`UserApi Error: ${error.message}`, error);

		const statusCode = error.statusCode || 400;
		const message = error.message || defaultMessage;

		return res.status(statusCode).json({
			error: message,
			timestamp: new Date().toISOString()
		});
	}

	async createUser(req, res) {
		try {
			const validatedData = this._validateUserData(req.body);
			const role = "viewer";

			const user = await UserController.create(
				validatedData.name,
				validatedData.email,
				validatedData.password,
				role
			);

			return res.status(201).json({
				success: true,
				data: user,
				message: "User created successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error creating user");
		}
	}

	async createAdmin(req, res) {
		try {
			const validatedData = this._validateUserData(req.body);
			const role = "admin";

			const user = await UserController.create(
				validatedData.name,
				validatedData.email,
				validatedData.password,
				role
			);

			return res.status(201).json({
				success: true,
				data: user,
				message: "Admin created successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error creating admin");
		}
	}

	async createSalesperson(req, res) {
		try {
			const validatedData = this._validateUserData(req.body);
			const role = "salesperson";

			const user = await UserController.create(
				validatedData.name,
				validatedData.email,
				validatedData.password,
				role,
				validatedData.commission
			);

			return res.status(201).json({
				success: true,
				data: user,
				message: "Salesperson created successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error creating salesperson");
		}
	}

	async updateUser(req, res) {
		try {
			const id = this._validateId(req.params.id || req.user?.id);
			const validatedData = this._validateUserData(req.body, false);

			const user = await UserController.update(
				id,
				validatedData.name,
				validatedData.email,
				validatedData.password
			);

			if (!user) {
				return res.status(404).json({
					success: false,
					error: "User not found"
				});
			}

			return res.status(200).json({
				success: true,
				data: user,
				message: "User updated successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error updating user");
		}
	}

	async updateUserInfo(req, res) {
		try {
			const id = this._validateId(req.params.id || req.user?.id);
			const { name, email, role, commission } = req.body;

			const validatedData = {
				name: name ? this._validateName(name) : undefined,
				email: email ? this._validateEmail(email) : undefined,
				role: role ? this._validateRole(role) : undefined,
				commission: commission !== undefined ? this._validateCommission(commission) : undefined
			};

			const user = await UserController.updateUserInfo(
				id,
				validatedData.name,
				validatedData.email,
				validatedData.role,
				validatedData.commission
			);

			if (!user) {
				return res.status(404).json({
					success: false,
					error: "User not found"
				});
			}

			return res.status(200).json({
				success: true,
				data: user,
				message: "User info updated successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error updating user info");
		}
	}

	async deleteUser(req, res) {
		try {
			const id = this._validateId(req.params.id || req.user?.user_id);

			const deleted = await UserController.delete(id);

			if (!deleted) {
				return res.status(404).json({
					success: false,
					error: "User not found"
				});
			}

			return res.status(204).send();
		} catch (error) {
			return this._handleError(res, error, "Error deleting user");
		}
	}

	async blockUser(req, res) {
		try {
			const id = this._validateId(req.params.id);

			const blocked = await UserController.block(id);

			if (!blocked) {
				return res.status(404).json({
					success: false,
					error: "User not found"
				});
			}

			return res.status(200).json({
				success: true,
				message: "User blocked successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error blocking user");
		}
	}

	async unlockUser(req, res) {
		try {
			const id = this._validateId(req.params.id);

			const unlocked = await UserController.unlock(id);

			if (!unlocked) {
				return res.status(404).json({
					success: false,
					error: "User not found"
				});
			}

			return res.status(200).json({
				success: true,
				message: "User unlocked successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error unlocking user");
		}
	}

	async findUsers(req, res) {
		try {
			const { page = 1, limit = 10, role, search, status } = req.query;

			const options = {
				page: Number(page),
				limit: Number(limit),
				role: role?.trim(),
				search: search?.trim(),
				status: status?.trim()
			};

			const users = await UserController.find(options);

			return res.status(200).json({
				success: true,
				data: users,
				message: "Users retrieved successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error listing users");
		}
	}

	async getCurrentUserInfo(req, res) {
		try {
			const id = req.user?.user_id;

			if (!id) {
				return res.status(400).json({
					success: false,
					error: "Unable to get user ID from token"
				});
			}

			const user = await UserController.findUser(id);

			if (!user) {
				return res.status(404).json({
					success: false,
					error: "User not found"
				});
			}

			return res.status(200).json({
				success: true,
				data: user,
				message: "Current user info retrieved successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error retrieving current user info");
		}
	}

	async findUserById(req, res) {
		try {
			const id = this._validateId(req.params.id);

			const user = await UserController.findUser(id);

			if (!user) {
				return res.status(404).json({
					success: false,
					error: "User not found"
				});
			}

			return res.status(200).json({
				success: true,
				data: user,
				message: "User retrieved successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error retrieving user");
		}
	}

	async getSalespersonById(req, res) {
		try {
			const id = this._validateId(req.params.id);

			const salesperson = await UserController.findSalespersonById(id);

			if (!salesperson) {
				return res.status(404).json({
					success: false,
					error: "Salesperson not found"
				});
			}

			return res.status(200).json({
				success: true,
				data: salesperson,
				message: "Salesperson retrieved successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error retrieving salesperson");
		}
	}

	async getSalespersons(req, res) {
		try {
			const { page = 1, limit = 10 } = req.query;

			const options = {
				page: Number(page),
				limit: Number(limit)
			};

			const salespersons = await UserController.findSalespersons(options);

			return res.status(200).json({
				success: true,
				data: salespersons,
				message: "Salespersons retrieved successfully"
			});
		} catch (error) {
			return this._handleError(res, error, "Error listing salespersons");
		}
	}

	async login(req, res) {
		try {
			const { email, password } = req.body;

			const validatedEmail = this._validateEmail(email);
			const validatedPassword = this._validatePassword(password);

			const response = await UserController.login(validatedEmail, validatedPassword);

			return res.status(200).json({
				success: true,
				data: response,
				message: "Login successful"
			});
		} catch (error) {
			return this._handleError(res, error, "Error logging in");
		}
	}
}

module.exports = new UserApi();
