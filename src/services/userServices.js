const { PrismaClient } = require("@prisma/client");
const generateHash = require("../utils/generateHash");
const prisma = new PrismaClient();
const HttpCodes = require("../config/returnCodes");

class UserService {
	//? vom lasa toate functiile ce pot fi accesate in afara clasei sus, pentru vizibilitate
	//? implementarile sunt descrie static, mai jos

	async addUser(newUser) {
		return UserService.insert(newUser);
	}

	async deleteUserByEmail(email) {
		return UserService.delete(email);
	}

	async markUserVerified(email) {
		return UserService.verify(email);
	}

	async existsInDB(email) {
		return UserService.checkExistence(email);
	}
	async existsInProfesorTable(email) {
		return UserService.checkExistenceProfesor(email);
	}

	async isVerifed(email) {
		return UserService.checkVerification(email);
	}

	async validCredentials(email, password) {
		return UserService.checkCredentials(email, password);
	}

	async addEmail(email, newEmail) {
		return UserService.insertSecondEmail(email, newEmail);
	}

	async hasSecondaryEmail(email) {
		return UserService.checkSecondEmail(email);
	}

	async getIdByEmail(email) {
		return UserService.getIdByEmailLogic(email);
	}
	async deleteUserFromLoggedTable(socket_id){
		return UserService.deleteUserFromLoggedInTable(socket_id);
	}
	async logUserIn(user) {
		return UserService.addUserInLoggedUsers(user);
	}

	async changePassword(email, password) {
		return UserService.changePasswordByEmail(email, password);
	}

	async getSocketById(id) {
		return UserService.SocketById(id);
	}

	async deleteLoggedOutUser(id) {
		return UserService.deleteLoggedOutUserById(id);
	}

    async isTeacher(email){
        return UserService.verifyTeacher(email)
    }

    async makeTeacher(email){
        return UserService.makeProf(email)
    }


	async isAdmin(email) {
		try {
			const admin = await prisma.admin.findUnique({
				where: {
					email: email,
				},
			});
			return {
				isAdmin: admin !== null,
				data: admin,
			};
		} catch (error) {
			console.error("Error:", error);
			return false;
		}
	}

	async isTeacher(email) {
		try {
			const teacher = await prisma.Teachers.findUnique({
				where: {
					email: email,
				},
			});
			return teacher !== null;
		} catch (error) {
			console.error("Error:", error);
			return;
		}
	}

	static async SocketById(id) {
		try {
			const socket = await prisma.LoggedUsers.findFirst({
				where: {
					uid: Number.parseInt(id),
				},
			});
			if (socket != null) {
				return {
					resCode: HttpCodes.SUCCESS,
					message: "User found",
					socket: socket.socket,
					username: socket.username,
				};
			}
			return {
				resCode: HttpCodes.USER_DOESNOT_EXIST,
				message: "User not logged in",
				socket: null,
			};
		} catch (error) {
			console.error("Error retrieving user:", error);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error retrieving user",
			};
		}
	}

	static async changePasswordByEmail(email, password) {
		try {
			await prisma.user.update({
				where: { emailPrimary: email },
				data: { password: password },
			});
			console.log("Password succesfully changed");
			return {
				resCode: HttpCodes.SUCCESS,
				message: "Password succesfully changed",
			};
		} catch (error) {
			console.error("Error changing password:", error);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error ocured at changing password in database",
			};
		}
	}

	static async getIdByEmailLogic(email) {
		try {
			const user = await prisma.user.findUnique({
				where: {
					emailPrimary: email,
				},
			});
			if (user != null) {
				return {
					resCode: HttpCodes.SUCCESS,
					message: "User found",
					uid: user.uid,
				};
			}
			console.log("User not found");
			return {
				resCode: HttpCodes.USER_DOESNOT_EXIST,
				message: "User not found",
			};
		} catch (error) {
			console.error("Error retrieving user:", error);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error retrieving user",
			};
		}
	}

	static async insert(newUser) {
		try {
			const profesorCheckResult = await UserService.checkExistenceProfesor(
				newUser.username,
			);

			const hashedPassword = generateHash(newUser.password);
			const isProfesor = profesorCheckResult.value;

			//insert in user
			const instance = await prisma.user.create({
				data: {
					emailPrimary: newUser.username,
					password: hashedPassword,
					emailSecondary: "null",
					profesorFlag: isProfesor ? 1 : 0,
					verifiedEmail: 0,
				},
			});

			console.log(`Added user ${instance.emailPrimary}`);

			// daca userul e si prof, adaugare si in teachers
			if (isProfesor) {
				const existingTeacher = await prisma.teachers.findUnique({
					where: { email: newUser.username },
				});

				if (!existingTeacher) {
					const instanceProfesor = await prisma.teachers.create({
						data: {
							email: newUser.username,
							materie: "nu stim..",
						},
					});
					console.log(`Added professor ${instanceProfesor.email}`);
				} else {
					console.log(
						`Professor with email ${newUser.username} already  exists`,
					);
				}
			}

			return {
				resCode: HttpCodes.SUCCESS,
				message: "Added user successfully",
			};
		} catch (error) {
			console.error(`Error inserting user -> ${error}`);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error adding user",
			};
		}
	}

	static async deleteUserFromLoggedInTable(socket_id){
		try {
			/*const instance = await prisma.loggedUsers.delete({
				where: {
					socket: socket_id,
				},
			});
			console.log(`Delete logged user with socket_id ${socket_id}`);*/
			//console.log("here" + socket_id);
        const result = await prisma.loggedUsers.deleteMany({
            where: {
                socket: socket_id,
            },
        });
        console.log(`Deleted ${result.count} users with socket_id ${socket_id}`);
       
			return {
				resCode: HttpCodes.SUCCESS,
				message: "Deleted socket successfully",
			};
		} catch (error) {
			console.error(`Error deleting socket from LoggedUsers -> ${error}`);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error deleting socket from LoggedUsers",
			};
		}
	}

	static async addUserInLoggedUsers(user) {
		try {
			const instance = await prisma.loggedUsers.create({
				data: {
					uid: user.uid,
					username: user.username,
					socket: user.socket,
				},
			});
			console.log(`Added user ${instance.username}`);
			return {
				resCode: HttpCodes.SUCCESS,
				message: "Logged in user succesfully",
			};
		} catch (error) {
			console.error(`Error inserting user in LoggedUsers -> ${error}`);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error inserting user in LoggedUsers",
			};
		}
	}

	static async delete(email) {
		try {
			await prisma.user.deleteMany({
				where: { emailPrimary: email },
			});
			await prisma.teachers.deleteMany({
				where: { email: email },
			}); //daca e prof
			console.log(`Deleted user with email ${email}`);
			return {
				resCode: HttpCodes.SUCCESS,
				message: "Deleted user succesfuly",
			};
		} catch (error) {
			console.error(`Error deleting entity -> ${error}`);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error deleting user",
			};
		}
	}

	static async verify(email) {
		try {
			await prisma.user.update({
				where: { emailPrimary: email },
				data: { verifiedEmail: 1 },
			});
			console.log("Updated user as verified");
			return {
				resCode: HttpCodes.SUCCESS,
				message: "Updated user as verified succesfully",
			};
		} catch (error) {
			console.error(`Error updating entity as verified: ${error}`);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error updating user as verified",
			};
		}
	}

	static async checkExistence(email) {
		try {
			const user = await prisma.user.findUnique({
				where: {
					emailPrimary: email,
				},
			});
			if (user !== null)
				return {
					resCode: HttpCodes.SUCCESS,
					message: "Existance checked",
					value: user !== null,
				};
			return {
				resCode: HttpCodes.USER_DOESNOT_EXIST,
				message: "User does not exist",
				value: user !== null,
			};
		} catch (error) {
			console.error(`Error retrieving user -> ${error}`);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error retrieving user",
				value: false,
			};
		}
	}
	static async checkExistenceProfesor(email) {
		try {
			const profesor = await prisma.Email_profesori.findUnique({
				where: {
					email: email,
				},
			});
			if (profesor !== null)
				return {
					resCode: HttpCodes.SUCCESS,
					message: "Profesor exists",
					value: profesor !== null,
				};
			return {
				resCode: HttpCodes.USER_DOESNOT_EXIST,
				message: "professor with this name does not exist",
				value: profesor !== null,
			};
		} catch (error) {
			console.error(`Error retrieving prof -> ${error}`);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error retrieving prof",
				value: false,
			};
		}
	}

	static async checkVerification(email) {
		try {
			const user = await prisma.user.findUnique({
				where: { emailPrimary: email },
			});
			if (user !== null && user.verifiedEmail === 1)
				return {
					resCode: HttpCodes.SUCCESS,
					message: "Verification succesfull",
					value: user && user.verifiedEmail === 1,
				};
			return {
				resCode: HttpCodes.UNVERIFIED_EMAIL,
				message: "User is not verified",
				value: user && user.verifiedEmail === 1,
			};
		} catch (error) {
			console.error("Error checking verification -> ", error);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error checking user",
				value: false,
			};
		}
	}

	static async checkCredentials(email, password) {
		try {
			const user = await prisma.user.findUnique({
				where: {
					emailPrimary: email,
				},
			});
			if (user == null) {
				return {
					resCode: HttpCodes.USER_DOESNOT_EXIST,
					message: "User does not exist",
				};
			}

			if (user.password !== password) {
				return {
					resCode: HttpCodes.WRONG_PASSWORD,
					message: "Wrong password",
				};
			}

			return {
				resCode: HttpCodes.SUCCESS,
				message: "Credentials are ok",
			};
		} catch (error) {
			console.error(`Error checking credentials ->${error}`);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error checking credentials",
			};
		}
	}

	static async insertSecondEmail(email, newEmail) {
		try {
			await prisma.user.update({
				where: { emailPrimary: email },
				data: {
					emailSecondary: newEmail,
				},
			});
			return {
				resCode: HttpCodes.SUCCESS,
				message: "Second email inserted succesfully",
			};
		} catch (error) {
			console.log("Error adding second email -> ", error);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error adding second email",
			};
		}
	}

	static async checkSecondEmail(email) {
		try {
			const user = await prisma.user.findUnique({
				where: {
					emailPrimary: email,
				},
			});
			if (user && user.emailSecondary !== "null")
				return {
					resCode: HttpCodes.SUCCESS,
					message: "Second email checked succesfully",
					value: user && user.emailSecondary !== "null",
				};
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Unable to check second email",
				value: user && user.emailSecondary !== "null",
			};
		} catch (error) {
			console.log(`Error checking secondary email: ${error}`);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error checking second email",
				value: true,
			};
		}
	}

    static async verifyTeacher(email){
        try {
            const user = await prisma.user.findFirst({
                where: {
                    emailPrimary: email,
                    profesorFlag: 1
                }
            });
            return user ? true : false;
        } catch (error) {
            console.log("Error searching teacher: " + error);
            return false;
        }   
    }

    static async makeProf(email){
        try {
            await prisma.user.update({
                where: {
                    emailPrimary: email
                },
                data: {
                    profesorFlag: 1
                }
            });
            return true;
        } catch (error) {
            console.log("Error making user a professor: " + error);
            return false;
        }   
    }

    static async verifyTeacher(email){
        try {
            const user = await prisma.user.findFirst({
                where: {
                    emailPrimary: email,
                    profesorFlag: 1
                }
            });
            return user ? true : false;
        } catch (error) {
            console.log("Error searching teacher: " + error);
            return false;
        }   
    }

    static async makeProf(email){
        try {
            await prisma.user.update({
                where: {
                    emailPrimary: email
                },
                data: {
                    profesorFlag: 1
                }
            });
            return true;
        } catch (error) {
            console.log("Error making user a professor: " + error);
            return false;
        }   
    }
		
	static async deleteLoggedOutUserById(id) {
		try {
			await prisma.loggedUsers.deleteMany({
				where: { uid: id },
			});
			console.log(`Deleted user with id ${id}`);
			return {
				resCode: HttpCodes.SUCCESS,
				message: "Deleted user succesfuly",
			};
		} catch (error) {
			console.error(`Error deleting entity -> ${error}`);
			return {
				resCode: HttpCodes.INTERNAL_SERVER_ERROR,
				message: "Error deleting user",
			};
		}
	}
}

module.exports = new UserService();