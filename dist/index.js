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
const docker_1 = __importDefault(require("./docker/docker"));
const helper_1 = require("./helper/helper");
const db_actions_1 = require("./Actions/db_actions");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Connect to MongoDB
mongoose_1.default
    .connect(`${process.env.MONGO_DB_URL}`)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((err) => console.error("MongoDB connection error:", err));
// The proxy will go here
const proxy = (0, express_1.default)();
proxy.get("*", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const url = req.get("host");
    if (!url) {
        return;
    }
    const hostname = url.split(".")[0];
    const container = yield (0, db_actions_1.getDataFromDb)(hostname);
    res.end();
    if (container) {
        res.redirect(`http://${container.ipAddress}:${container.port}`);
    }
    else {
        res.json({
            error: "Internall server error",
        });
    }
}));
docker_1.default.getEvents((err, stream) => {
    if (err) {
        console.error("Error listening to docker event:", err);
        return;
    }
    if (!stream)
        return;
    stream.on("data", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const event = JSON.parse(data.toString());
        if (event.Type === "container" && event.Action === "start") {
            const { ipAddress, port } = yield (0, helper_1.getContainerIp)(event.id);
            const id = event.id;
            const conatainerName = event.Actor.Attributes.name;
            console.log("container PORT", port.split("/")[0]);
            console.log("container IpAddress", ipAddress);
            if (!ipAddress)
                return;
            (0, db_actions_1.saveDataToDB)(conatainerName, port, ipAddress, id);
        }
        if (event.Type === "container" && event.Action === "die") {
            const conatainerName = event.Actor.Attributes.name;
            const isDeleted = yield (0, db_actions_1.deleteFromDb)(conatainerName);
            if (isDeleted) {
                return;
            }
            else {
                return;
            }
        }
    }));
});
proxy.listen(80, () => {
    console.log("Proxy listen on port 80");
});
