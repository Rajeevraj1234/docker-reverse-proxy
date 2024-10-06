import mongoose from "mongoose";

const Proxy_container_schema = new mongoose.Schema({
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

const Container = mongoose.model("Container", Proxy_container_schema);

export default Container;
