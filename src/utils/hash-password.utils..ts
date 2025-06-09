
import * as bcrypt from 'bcrypt';

export async function hashPassword(plainPassword: string) {
  const saltOrRounds = 10;
  const hash = await bcrypt.hash(plainPassword, saltOrRounds);
  console.log("hashed password: ", hash);
  return hash;
}
