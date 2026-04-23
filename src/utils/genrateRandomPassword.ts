export default function generateRandomPassword(length = 12): string {
  if (length < 8) {
    throw new Error("Password length must be at least 8 to include all character types");
  }

  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*_-+=?"; // SAFE SPECIAL CHARS

  // Pick at least 1 char from each type
  const passwordChars: string[] = [];
  passwordChars.push(upper[Math.floor(Math.random() * upper.length)]);
  passwordChars.push(lower[Math.floor(Math.random() * lower.length)]);
  passwordChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
  passwordChars.push(special[Math.floor(Math.random() * special.length)]);

  const allChars = upper + lower + numbers + special;

  // Fill remaining length
  for (let i = passwordChars.length; i < length; i++) {
    passwordChars.push(allChars[Math.floor(Math.random() * allChars.length)]);
  }

  // Shuffle array to make position of first 4 chars random
  for (let i = passwordChars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
}
