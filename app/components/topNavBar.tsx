import { useNavigate } from "@remix-run/react";
import { Form } from "@remix-run/react";

// export function handleLogout() {
//   sessionStorage.removeItem("user");

//   fetch("/log-out", { method: "POST" })
//     .then((response) => {
//       if (response.redirected) {
//         // Use the redirect URL provided by the server
//         window.location.href = response.url;
//       } else {
//         console.error("No redirection occurred, response:", response);
//       }
//     })
//     .catch((error) => console.error("Logout failed", error));
// }

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between bg-gray-400/70 backdrop-blur-lg text-white h-[70px] p-4">
      <div className="p-4 text-lg font-bold">
        <img
          src="/logo_UniNet_text.png" // Corrected path
          alt="Uninet Logo"
          className="h-8 w-[150px]"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Form method="post" action="/log-out">
          <button type="submit" className="text-white">
            Logout
          </button>
        </Form>
      </div>
    </div>
  );
}