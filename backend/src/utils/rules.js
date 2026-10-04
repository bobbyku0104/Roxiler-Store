const NAME_MIN = 20;
const NAME_MAX = 60;
const STORE_NAME_MAX = 60;
const ADDRESS_MAX = 400;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGES = {
  name: `Name must be between ${NAME_MIN} and ${NAME_MAX} characters`,
  storeName: `Store name is required and can be at most ${STORE_NAME_MAX} characters`,
  address: `Address can be at most ${ADDRESS_MAX} characters`,
  password: 'Password must be 8-16 characters with at least one uppercase letter and one special character',
  email: 'Enter a valid email address',
};

function isValidPersonName(value) {
  const length = String(value || '').trim().length;
  return length >= NAME_MIN && length <= NAME_MAX;
}

function isValidPassword(value) {
  return PASSWORD_REGEX.test(String(value || ''));
}

function isValidEmail(value) {
  return EMAIL_REGEX.test(String(value || '').trim());
}

module.exports = {
  NAME_MIN,
  NAME_MAX,
  STORE_NAME_MAX,
  ADDRESS_MAX,
  PASSWORD_REGEX,
  MESSAGES,
  isValidPersonName,
  isValidPassword,
  isValidEmail,
};
