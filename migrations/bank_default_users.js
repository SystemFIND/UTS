const logger = require('../src/core/logger')('api');
const { User } = require('../src/models');
const { hashPassword } = require('../src/utils/password');

const namaLengkap = 'Administrator';
const email = 'admin@bank.co.id';
const password = 'UypZ208#$';
const pin = 532345;
const jenisTabungan = 'Special';
const saldo = 0;

logger.info('Membuat default Users');

(async () => {
  try {
    const newUsers = await User.countDocuments({
      namaLengkap,
      email,
      jenisTabungan,
    });

    if (newUsers > 0) {
      throw new Error(`User ${email} sudah dibuat`);
    }

    const hashedPassword = await hashPassword(password, pin);
    await User.create({
      namaLengkap,
      email,
      password: hashedPassword,
      pin: hashedPassword,
      jenisTabungan,
      saldo,
    });
  } catch (e) {
    logger.error(e);
  } finally {
    process.exit(0);
  }
})();
