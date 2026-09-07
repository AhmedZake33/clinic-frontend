/**
 * Password Strength Utility & Generator
 */

export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      hasMinLength: false,
      hasLower: false,
      hasUpper: false,
      hasNumber: false,
      hasSymbol: false,
      score: 0,
      strengthLabel: 'weak',
    }
  }

  const hasMinLength = password.length >= 8
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(password)

  let score = 0
  if (hasMinLength) score += 1
  if (hasLower && hasUpper) score += 1
  if (hasNumber) score += 1
  if (hasSymbol) score += 1

  let strengthLabel = 'weak'
  if (score >= 4) {
    strengthLabel = 'strong'
  } else if (score >= 2) {
    strengthLabel = 'medium'
  }

  const isValid = hasMinLength && hasLower && hasUpper && hasNumber && hasSymbol

  return {
    isValid,
    hasMinLength,
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    score,
    strengthLabel,
  }
}

export function generateStrongPassword(length = 12) {
  const lowercase = 'abcdefghijkmnpqrstuvwxyz' // removed ambiguous characters like l, o
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // removed I, O
  const numbers = '23456789' // removed 0, 1
  const symbols = '!@#$%&*?_+'

  let password = ''
  // Ensure at least one of each
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length))
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length))
  password += numbers.charAt(Math.floor(Math.random() * numbers.length))
  password += symbols.charAt(Math.floor(Math.random() * symbols.length))

  const allChars = lowercase + uppercase + numbers + symbols
  for (let i = 4; i < length; i += 1) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => 0.5 - Math.random())
    .join('')
}
