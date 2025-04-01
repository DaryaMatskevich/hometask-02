import bcrypt from 'bcrypt'

const saltRounds = 10;
export const bcryptService = {
   async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds)
    },

    async checkPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }
}
