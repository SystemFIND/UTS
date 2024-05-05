const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../../utils/password');
const { func } = require('joi');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      namaLengkap: user.namaLengkap,
      email: user.email,
      jenisTabungan: user.jenisTabungan,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    namaLengkap: user.namaLengkap,
    email: user.email,
    jenisTabungan: user.jenisTabungan,
  };
}

async function balanced(id) {
  const saldo = await usersRepository.getBalanced(id);

  return {
    saldo: saldo,
  };
}

/**
 * Create new user
 * @param {string} namaLengkap - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(namaLengkap, email, password, jenisTabungan) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(
      namaLengkap,
      email,
      hashedPassword,
      jenisTabungan
    );
  } catch (err) {
    return null;
  }

  return true;
}

async function deposit(id, jumlahSetoran) {
  try {
    const user = await usersRepository.getUser(id);

    if (!user) {
      return null;
    }

    user.saldo += jumlahSetoran;

    await user.save();
    return user;
  } catch (err) {
    return null;
  }
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} namaLengkap - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, namaLengkap, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, namaLengkap, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

async function changePin(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

/**
 * Change user password
 * @param {Integer} page_number - Page
 * @param {Integer} page_size - Limit
 * @param {String} search - Search
 * @param {String} sort - Sort
 */
async function paginate(page_number, page_size, search, sort) {
  const startIndex = (page_number - 1) * page_size;
  const endIndex = page_number * page_size;

  // Mengambil data menggunakan getUser
  const users = await getUsers();

  // Search
  let filter = users;
  if (search) {
    // Deklarasi sekaligus mengconvert to lowercase
    // convert to lowercase agar bisa mencakup uppercase
    const [email, key] = search.split(':').map((part) => part.toLowerCase());

    filter = filter.filter((user) => user[email].toLowerCase().includes(key));
  }

  // Sort
  // Apply sorting based on sort criteria
  if (sort) {
    const [email, order] = sort.split(':');
    filter.sort((a, b) => {
      if (order === 'desc') {
        return b[email].localeCompare(a[email]);
      } else {
        return a[email].localeCompare(b[email]);
      }
    });
  }

  // Pagination
  const paginated = filter.slice(startIndex, endIndex);

  return {
    page_number: page_number,
    page_size: page_size,
    count: paginated.length,
    total_pages: Math.ceil(filter.length / page_size),
    has_previous_page: page_number > 1,
    has_next_page: endIndex < filter.length,
    data: paginated,
  };
}

module.exports = {
  getUsers,
  getUser,
  balanced,
  createUser,
  deposit,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
  changePin,
  paginate,
};
