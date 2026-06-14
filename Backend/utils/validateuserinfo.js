const { body, validationResult } = require('express-validator');

const validateRegister = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be 3-30 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain alphanumeric, dash, underscore'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/)
        .withMessage('Password must contain lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain number')
        .matches(/[!@#$%^&*]/)
        .withMessage('Password must contain special character'),
];

const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

const checkValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    checkValidationErrors,
};