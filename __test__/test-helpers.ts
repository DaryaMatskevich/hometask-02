import { app } from '../src/app';
import { agent } from "supertest";
import { SETTINGS } from '../src/settings';

export const req = agent(app)

export const testDb = {
    async clearDb() {
        await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
    }
}