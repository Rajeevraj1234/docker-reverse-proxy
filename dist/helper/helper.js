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
exports.getContainerIp = getContainerIp;
const docker_1 = __importDefault(require("../docker/docker"));
function getContainerIp(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const container = docker_1.default.getContainer(id);
        try {
            const data = yield container.inspect();
            const port = Object.keys(data.NetworkSettings.Ports)[0];
            const networks = data.NetworkSettings.Networks;
            const networkName = Object.keys(networks)[0]; // Get the first network name
            const ipAddress = networks[networkName].IPAddress;
            return { ipAddress, port }; // Return the IP address once resolved
        }
        catch (err) {
            console.error("Error inspecting container:", err);
            return { ipAddress: "0.0.0.0", port: 0 };
        }
    });
}
