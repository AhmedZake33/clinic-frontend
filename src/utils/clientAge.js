export const calculateAgeFromBirthDate = (value, fallback = null) => {
  if (!value) {
    return fallback
  }

  const str = String(value).trim()
  const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)

  let birthDate
  if (match) {
    birthDate = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  } else {
    birthDate = new Date(str)
  }

  if (Number.isNaN(birthDate.getTime())) {
    return fallback
  }

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDifference = today.getMonth() - birthDate.getMonth()

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }

  return age >= 0 ? age : fallback
}

export const formatAgeFromBirthDate = (value, translate, fallback = null) => {
  const age = calculateAgeFromBirthDate(value, null)

  if (age === null) {
    return fallback
  }

  return `${age} ${translate('client.ageUnit')}`
}

export const formatBirthDate = (value, locale = 'en', fallback = null) => {
  if (!value) {
    return fallback
  }

  const str = String(value).trim()
  const match = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)

  let year
  let month
  let day

  if (match) {
    year = Number(match[1])
    month = Number(match[2]) - 1
    day = Number(match[3])
  } else {
    const d = new Date(str)
    if (Number.isNaN(d.getTime())) {
      return fallback || value
    }
    year = d.getFullYear()
    month = d.getMonth()
    day = d.getDate()
  }

  const date = new Date(year, month, day)
  if (Number.isNaN(date.getTime())) {
    return fallback || value
  }

  const isAr = locale && String(locale).toLowerCase().startsWith('ar')

  try {
    return new Intl.DateTimeFormat(isAr ? 'ar' : 'en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  } catch (e) {
    return `${day}/${month + 1}/${year}`
  }
}
