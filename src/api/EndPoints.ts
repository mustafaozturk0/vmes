export const DevRootURL = `${process.env.REACT_APP_URI}`;

export const EndPoints = {
  auth: `${DevRootURL}/api/auth`,
  camera: `${DevRootURL}/api/camera`,
  polygon: `${DevRootURL}/api/polygon`,
  yolo: `${DevRootURL}/api/yolo`,
  output: `${DevRootURL}/api/output`,
  record: `${DevRootURL}/api/record`,
  machine: `${DevRootURL}/api/machine`,
  factory: `${DevRootURL}/api/factory`,
  line: `${DevRootURL}/api/line`,
  machineLogs: `${DevRootURL}/api/machineLog`,
  vggModels: `${DevRootURL}/api/vggModels`,
};
