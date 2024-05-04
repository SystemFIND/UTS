const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');

// Untuk menghitung jumlah login yang gagal
const loginAttempts = new Map();

const maxAttempts = 5; // Maximum Wrong login
const duration = 30 * 60 * 1000; //Durasi tidak bisa login 30 menit

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // mengecek apakah user dikenakan block atau tidak
    const Blocked = loginAttempts.get(email);
    if (Blocked && Blocked.attempts >= maxAttempts) {
      const time = Date.now(); // mengambil waktu real time

      if (time - Blocked.lastAttempts < duration) {
        throw errorResponder(
          errorTypes.FORBIDDEN,
          'Too many login attemps. Please try again later.'
        );
      } else {
        // Reset jumlah login attemps
        loginAttempts.delete(email);
      }
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      // increments for wrong login, start from 0
      const attempts = (loginAttempts.get(email)?.attempts || 0) + 1;
      const lastAttempts = Date.now();
      loginAttempts.set(email, { attempts, lastAttempts });

      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
