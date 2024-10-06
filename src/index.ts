import docker from "./docker/docker";
import { getContainerIp } from "./helper/helper";
import {
  saveDataToDB,
  deleteFromDb,
  getDataFromDb,
} from "./Actions/db_actions";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(`${process.env.MONGO_DB_URL}`)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err: any) => console.error("MongoDB connection error:", err));

// The proxy will go here
const proxy = express();
proxy.get("*", async (req, res) => {
  const url = req.get("host");
  if (!url) {
    return;
  }
  const hostname = url.split(".")[0];
  const container = await getDataFromDb(hostname);
  if (container) {
    res.redirect(`http://${container.ipAddress}:${container.port}`);
  } else {
    res.json({
      error: "Internall server error",
    });
  }
});

docker.getEvents((err, stream) => {
  if (err) {
    console.error("Error listening to docker event:", err);
    return;
  }
  if (!stream) return;
  stream.on("data", async (data) => {
    const event = JSON.parse(data.toString());
    if (event.Type === "container" && event.Action === "start") {
      const { ipAddress, port } = await getContainerIp(event.id);
      const id = event.id;
      const conatainerName = event.Actor.Attributes.name;
      console.log("container PORT", port.split("/")[0]);
      console.log("container IpAddress", ipAddress);
      if (!ipAddress) return;

      saveDataToDB(conatainerName, port, ipAddress, id);
    }
    if (event.Type === "container" && event.Action === "die") {
      const conatainerName = event.Actor.Attributes.name;
      const isDeleted = await deleteFromDb(conatainerName);

      if (isDeleted) {
        return;
      } else {
        return;
      }
    }
  });
});

proxy.listen(80, () => {
  console.log("Proxy listen on port 80");
});
