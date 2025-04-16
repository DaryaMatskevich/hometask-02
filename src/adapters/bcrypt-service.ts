import bcrypt from 'bcrypt'
import { injectable } from 'inversify';

const saltRounds = 10;
@injectable()
export class BcryptService {
   async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, saltRounds)
    }

    async checkPassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }
}
