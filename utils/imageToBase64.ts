import { RcFile } from "antd/es/upload";

export const fileToBase64 = (file: RcFile | Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const lesionImageToBase64 = async (
  value: RcFile | string
): Promise<string> => {
  if (value instanceof Blob) {
    return fileToBase64(value);
  }
  if (typeof value === "string" && value.startsWith("data:")) {
    return value.split(",")[1] || value;
  }
  throw new Error("Invalid lesion image");
};
