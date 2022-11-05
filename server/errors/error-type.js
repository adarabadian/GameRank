let ErrorType = {
	GENERAL_ERROR: {
		id: 1,
		httpCode: 600,
		message: "A General Error Has Occurred.",
		isShowStackTrace: true,
	},
	USER_ALREADY_EXISTS: {
		id: 2,
		httpCode: 601,
		message: "This Username or Email already exists. If you've already registered please go back to login page.",
		isShowStackTrace: true,
	},
	WRONG_EMAIL_OR_PASSWORD: {
		id: 3,
		httpCode: 602,
		message: "Wrong email or password.",
		isShowStackTrace: true,
	},
	INSUFFICIENT_PRIVILEGES: {
		id: 4,
		httpCode: 603,
		message: "You don't have premission to perform this operation.",
		isShowStackTrace: true,
	},
	WRONG_FIELD_LENGTHS: {
		id: 5,
		httpCode: 604,
		message: "You didn't filled all the parameters with the correct field lengths.",
		isShowStackTrace: true,
	},
	INCORRECT_CODE: {
		id: 6,
		httpCode: 605,
		message: "The verification code you submitted is not correct.\n We've sent a new code to your email address.",
		isShowStackTrace: true,
	},
	USER_NOT_VALIDATED: {
		id: 7,
		httpCode: 606,
		message: "It seem's that you didn't validated your user.\nWe sent you a new code to your email and enter the code from the mail.",
		isShowStackTrace: true,
	}

}

module.exports = ErrorType;