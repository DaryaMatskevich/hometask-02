"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testDb = exports.req = void 0;
const app_1 = require("../src/app");
const supertest_1 = require("supertest");
const settings_1 = require("../src/settings");
exports.req = (0, supertest_1.agent)(app_1.app);
exports.testDb = {
    clearDb() {
        return __awaiter(this, void 0, void 0, function* () {
            yield exports.req.delete(`${settings_1.SETTINGS.PATH.TESTING}/all-data`);
        });
    }
};
