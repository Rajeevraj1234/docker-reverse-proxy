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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDataToDB = saveDataToDB;
exports.deleteFromDb = deleteFromDb;
exports.getDataFromDb = getDataFromDb;
const containerSchema_1 = __importDefault(require("../containerSchema"));
function saveDataToDB(containerName, port, ipAddress, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const newContainer = new containerSchema_1.default({
            id,
            containerName,
            port: parseInt(port),
            ipAddress,
        });
        newContainer
            .save()
            .then(() => {
            console.log("Container created");
        })
            .catch((err) => {
            console.error("Error saving the data:", err);
        });
    });
}
function deleteFromDb(containerName) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield containerSchema_1.default.deleteOne({ containerName });
        if (res.acknowledged) {
            return res.acknowledged;
        }
        else {
            return false;
        }
    });
}
// No need for an additional type alias
function getDataFromDb(hostname) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = yield containerSchema_1.default.findOne({ containerName: hostname });
        if (container) {
            return container;
        }
        return null;
    });
}
