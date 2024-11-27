import { useNavigate } from "@remix-run/react";
import { Form } from "@remix-run/react";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between bg-[#fafafa]/80 backdrop-blur-3xl text-[#333333] p-4 h-[50px]">
      <div className="p-4 text-lg font-bold">
        <img
          src="/logo_UniNet_text.png" // Corrected path
          alt="Uninet Logo"
          className="h-6 w-auto" 
          onClick={() => navigate("/dash/id")}
        />
      </div>
      <div className="flex items-center space-x-4">
        <Form method="post" action="/log-out">
          <button type="submit"
          className="inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-gray-50 backdrop-blur-3xl"
          >
            Logout
          </button>
        </Form>
      </div>
    </div>
  );
}