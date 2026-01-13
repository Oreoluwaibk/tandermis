export function toFormData(payload: Record<string, any>): FormData {
  // Use the browser FormData if available, otherwise fallback to a polyfill
  const formData = new (typeof window !== "undefined" ? FormData : (require("form-data") as any))();

  const appendFormData = (data: any, parentKey?: string) => {
    if (data && typeof data === "object" && !(data instanceof File) && !(data instanceof Blob)) {
      Object.keys(data).forEach((key) => {
        appendFormData(data[key], parentKey ? `${parentKey}[${key}]` : key);
      });
    } else {
      formData.append(parentKey!, data == null ? "" : data);
    }
  };

  appendFormData(payload);
  return formData;
}