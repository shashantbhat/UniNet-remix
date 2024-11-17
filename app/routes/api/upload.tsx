import { json, unstable_parseMultipartFormData } from "@remix-run/node";
import { uploadToCloudStorage } from "~/utils/cloud-storage"; // Your cloud upload logic

export async function action({ request }: { request: Request }) {
  const formData = await unstable_parseMultipartFormData(request, async (field, file) => {
    return await uploadToCloudStorage(file);
  });

  return json({ success: true, fileUrls: formData });
}