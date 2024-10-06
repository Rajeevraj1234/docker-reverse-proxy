"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Proxy_container_schema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    containerName: {
        type: String,
        required: true,
        unique: true,
    },
    port: {
        type: Number,
        required: true,
        unique: true,
    },
    ipAddress: {
        type: String,
        required: true,
        unique: true,
    },
});
const Container = mongoose_1.default.model("Container", Proxy_container_schema);
exports.default = Container;
