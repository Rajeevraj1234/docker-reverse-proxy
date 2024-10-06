import docker from "../docker/docker";
interface getContainerReturnProp {
  ipAddress: string;
  port: any;
}
export async function getContainerIp(
  id: string,
): Promise<getContainerReturnProp> {
  const container = docker.getContainer(id);
  try {
    const data = await container.inspect();
    const port = Object.keys(data.NetworkSettings.Ports)[0];
    const networks = data.NetworkSettings.Networks;
    const networkName = Object.keys(networks)[0]; // Get the first network name
    const ipAddress = networks[networkName].IPAddress;
    return { ipAddress, port }; // Return the IP address once resolved
  } catch (err) {
    console.error("Error inspecting container:", err);
    return { ipAddress: "0.0.0.0", port: 0 };
  }
}
