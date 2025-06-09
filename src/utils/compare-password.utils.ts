import * as bcrypt from 'bcrypt';

export async function comparePassword(plainPassword: string, hashPassword: string) {
  const isMatch = await bcrypt.compare(plainPassword, hashPassword);
  return isMatch;
}