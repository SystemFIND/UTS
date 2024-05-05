const { User } = require('../../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

async function getBalanced(id) {
  return User.findOne({ _id: id });
}

/**
 * Create new user
 * @param {string} namaLengkap - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(namaLengkap, email, password, pin, jenisTabungan) {
  return User.create({
    namaLengkap,
    email,
    password,
    pin,
    jenisTabungan,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} namaLengkap - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, namaLengkap, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        namaLengkap,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

async function changePin(id, pin) {
  return User.updateOne({ _id: id }, { $set: { pin } });
}

module.exports = {
  getUsers,
  getUser,
  getBalanced,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  changePin,
};
