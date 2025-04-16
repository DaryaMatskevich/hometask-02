import { app } from '../app';
import { agent } from "supertest";
import { SETTINGS } from '../settings';

export const req = agent(app)

export const testDb = {
    async clearDb() {
        await req.delete(`${SETTINGS.PATH.TESTING}/all-data`)
    }
}