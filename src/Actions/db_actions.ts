import Container from "../containerSchema";

export async function saveDataToDB(
  containerName: string,
  port: string,
  ipAddress: string,
  id: string,
) {
  const newContainer = new Container({
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
}

export async function deleteFromDb(containerName: string): Promise<boolean> {
  const res = await Container.deleteOne({ containerName });
  if (res.acknowledged) {
    return res.acknowledged;
  } else {
    return false;
  }
}
interface ContainerProp {
  id: string;
  containerName: string;
  port: number;
  ipAddress: string;
  _id: object;
}

// No need for an additional type alias
export async function getDataFromDb(
  hostname: string,
): Promise<ContainerProp | null> {
  const container = await Container.findOne({ containerName: hostname });
  if (container) {
    return container;
  }
  return null;
}
