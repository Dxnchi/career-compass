// src/utils/saIdValidator.js

export function validateSouthAfricanID(idNumber) {
  const cleanId = String(idNumber || '').replace(/\s+/g, '');

  // 1. Must be exactly 13 numeric digits
  if (!/^\d{13}$/.test(cleanId)) {
    return {
      isValid: false,
      error: 'SA ID number must be exactly 13 digits.',
    };
  }

  // 2. Extract Date of Birth (YYMMDD)
  const yy = parseInt(cleanId.substring(0, 2), 10);
  const mm = parseInt(cleanId.substring(2, 4), 10);
  const dd = parseInt(cleanId.substring(4, 6), 10);

  // Determine century (pivot against current 2-digit year)
  const currentYearShort = new Date().getFullYear() % 100;
  const fullYear = yy <= currentYearShort ? 2000 + yy : 1900 + yy;

  // Verify calendar month and day
  const birthDate = new Date(fullYear, mm - 1, dd);
  if (
    birthDate.getFullYear() !== fullYear ||
    birthDate.getMonth() + 1 !== mm ||
    birthDate.getDate() !== dd
  ) {
    return {
      isValid: false,
      error: 'ID contains an invalid birth date (YYMMDD).',
    };
  }

  // 3. Citizenship digit (Index 10: must be 0 for SA citizen, 1 for permanent resident)
  const citizenshipDigit = parseInt(cleanId.charAt(10), 10);
  if (citizenshipDigit !== 0 && citizenshipDigit !== 1) {
    return {
      isValid: false,
      error: 'Invalid citizenship digit in ID number.',
    };
  }

  // 4. Luhn Algorithm Checksum Validation
  let sum = 0;
  let shouldDouble = false;

  for (let i = cleanId.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanId.charAt(i), 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  if (sum % 10 !== 0) {
    return {
      isValid: false,
      error: 'Invalid SA ID number (checksum verification failed).',
    };
  }

  // 5. Extract metadata (Gender & Citizenship)
  const genderCode = parseInt(cleanId.substring(6, 10), 10);
  const gender = genderCode >= 5000 ? 'Male' : 'Female';
  const citizenship = citizenshipDigit === 0 ? 'SA Citizen' : 'Permanent Resident';

  return {
    isValid: true,
    error: null,
    dateOfBirth: `${fullYear}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`,
    gender,
    citizenship,
  };
}
