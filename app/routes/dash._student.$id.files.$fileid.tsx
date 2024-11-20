import { useParams } from "@remix-run/react";
import DashboardLayout from "~/components/dashboard_layout";

export default function Dashboard() {
  const { id,fileid } = useParams(); // Extracts the dynamic `id` from the URL

  return (
    <>
      <div>
        <h1>Student Details</h1>
        <p>Student ID: {fileid}</p>
      </div>
    </>
  );
}