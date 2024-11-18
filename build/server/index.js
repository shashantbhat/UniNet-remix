import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useParams, useLoaderData, useActionData, Form, useNavigate, Link } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect, useRef } from "react";
import { BlobServiceClient } from "@azure/storage-blob";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { nanoid } from "nanoid";
import { gsap } from "gsap";
import { useNavigate as useNavigate$1 } from "react-router-dom";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App$1() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  default: App$1,
  links
}, Symbol.toStringTag, { value: "Module" }));
const CommunityOperated = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSearchClick = () => {
    alert("Search clicked!");
  };
  const handleFileClick = () => {
    window.location.href = "/404";
  };
  const { id } = useParams();
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-screen p-4", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        className: "bg-blue-500 text-white py-2 px-4 rounded mb-4 self-start",
        onClick: () => {
          window.location.href = `/dash/${id}/upload-material`;
        },
        children: "Add New File"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex mb-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search files...",
          value: searchTerm,
          onChange: handleSearchChange,
          className: "p-2 border rounded flex-grow"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "bg-blue-500 text-white py-2 px-4 rounded ml-2",
          onClick: handleSearchClick,
          children: "Search"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full bg-white", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { className: "py-2 px-4 border-b text-center", children: "File Name" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 px-4 border-b text-center", children: "Date Created" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 px-4 border-b text-center", children: "Tags" }),
        /* @__PURE__ */ jsx("th", { className: "py-2 px-4 border-b text-center", children: "Rating" })
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "py-2 px-4 border-b text-center", children: /* @__PURE__ */ jsx("a", { href: "#", onClick: handleFileClick, className: "text-blue-500", children: "File1.txt" }) }),
          /* @__PURE__ */ jsx("td", { className: "py-2 px-4 border-b text-center", children: "2023-01-01" }),
          /* @__PURE__ */ jsx("td", { className: "py-2 px-4 border-b text-center", children: "Tag1, Tag2" }),
          /* @__PURE__ */ jsx("td", { className: "py-2 px-4 border-b text-center", children: "⭐⭐⭐⭐⭐" })
        ] }),
        /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsx("td", { className: "py-2 px-4 border-b text-center", children: /* @__PURE__ */ jsx("a", { href: "#", onClick: handleFileClick, className: "text-blue-500", children: "File2.txt" }) }),
          /* @__PURE__ */ jsx("td", { className: "py-2 px-4 border-b text-center", children: "2023-01-02" }),
          /* @__PURE__ */ jsx("td", { className: "py-2 px-4 border-b text-center", children: "Tag3, Tag4" }),
          /* @__PURE__ */ jsx("td", { className: "py-2 px-4 border-b text-center", children: "⭐⭐⭐⭐" })
        ] })
      ] })
    ] }) })
  ] });
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CommunityOperated
}, Symbol.toStringTag, { value: "Module" }));
dotenv.config();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});
let sessionStorage$1 = createCookieSessionStorage({
  cookie: {
    name: "_session",
    // use any name you want here
    sameSite: "lax",
    // this helps with CSRF
    path: "/",
    // remember to add this so the cookie will work in all routes
    httpOnly: true,
    // for security reasons, make this cookie http only
    secrets: ["s3cr3t"],
    // replace this with an actual secret
    secure: process.env.NODE_ENV === "production"
    // enable this in prod only
  }
});
const authenticator = new Authenticator(sessionStorage$1, {
  sessionKey: "sessionKey",
  // keep in sync
  sessionErrorKey: "sessionErrorKey"
  // keep in sync
});
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");
    if (!email || (email == null ? void 0 : email.length) === 0)
      throw new AuthorizationError("Bad Credentials: Email is required");
    if (typeof email !== "string")
      throw new AuthorizationError("Bad Credentials: Email must be a string");
    if (!password || (password == null ? void 0 : password.length) === 0)
      throw new AuthorizationError("Bad Credentials: Password is required");
    if (typeof password !== "string")
      throw new AuthorizationError(
        "Bad Credentials: Password must be a string"
      );
    const client = await pool.connect();
    try {
      const res = await client.query("SELECT * FROM users WHERE email = $1", [
        email
      ]);
      const user2 = res.rows[0];
      console.log(user2);
      if (user2 && await bcrypt.compare(password, user2.password_hash)) {
        return {
          name: user2.name,
          token: `${user2.id}-${(/* @__PURE__ */ new Date()).getTime()}`,
          id: user2.id,
          university_id: user2.university_id,
          email: user2.email,
          role: user2.role
        };
      } else {
        throw new AuthorizationError("Bad Credentials");
      }
    } finally {
      client.release();
    }
  })
);
let loader$2 = async ({ request }) => {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/login"
  });
};
const action$3 = async ({ request }) => {
  var _a, _b;
  try {
    const formData = await request.formData();
    const title = (_a = formData.get("title")) == null ? void 0 : _a.toString();
    const description = (_b = formData.get("description")) == null ? void 0 : _b.toString();
    const file = formData.get("file");
    if (!file || !title) {
      throw new Error("Missing required fields");
    }
    const { id: uploaderId, university_id: universityId } = await authenticator.isAuthenticated(request);
    const accountName = "uninetfilestorage";
    const sasToken = "sv=2022-11-02&ss=bfqt&srt=o&sp=rwdlacupiytfx&se=2025-11-19T01:04:20Z&st=2024-11-18T17:04:20Z&spr=https&sig=W8xjgWJg%2B1iglBBwGFZ2Ch3ztceukLpha%2BLmYc4V%2Fdc%3D";
    const containerName = "blobby";
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net?${sasToken}`
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(file.name);
    const fileBuffer = await file.arrayBuffer();
    await blockBlobClient.uploadData(fileBuffer);
    const fileUrl = blockBlobClient.url;
    const query = `
      INSERT INTO files (
        uploader_id, university_id, title, description, file_url
      ) VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [uploaderId, universityId, title, description, fileUrl];
    await pool.query(query, values);
    return json({ message: "File uploaded and metadata saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    return json(
      { error: "Failed to upload file or save metadata" },
      { status: 500 }
    );
  }
};
function StudyMaterial() {
  useLoaderData();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: ""
  });
  const handleFileUpload = (event) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      files.forEach((file) => formDataToSend.append("file", file));
      const response = await fetch("", {
        method: "POST",
        body: formDataToSend
      });
      if (!response.ok) {
        throw new Error("Failed to upload file or save metadata");
      }
      alert("File uploaded and metadata saved successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload file or save metadata.");
    } finally {
      setUploading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white shadow-md rounded-md", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-4", children: "Study Material" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium", children: "Title" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "title",
            value: formData.title,
            onChange: handleInputChange,
            required: true,
            className: "block w-full text-sm text-gray-500 border border-gray-300 bg-gray-50 focus:outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium", children: "Description" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            name: "description",
            value: formData.description,
            onChange: handleInputChange,
            className: "block w-full text-sm text-gray-500 border border-gray-300 bg-gray-50 focus:outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium", children: "Upload Files" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            multiple: true,
            accept: "image/*,.pdf",
            onChange: handleFileUpload,
            required: true,
            className: "block w-full text-sm text-gray-500 border border-gray-300 cursor-pointer bg-gray-50 focus:outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
          disabled: uploading,
          children: uploading ? "Uploading..." : "Upload"
        }
      )
    ] })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
  default: StudyMaterial,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const action$2 = async ({ request }) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const collegeName = formData.get("universityName");
  const city = formData.get("city");
  const adminEmail = formData.get("Email");
  formData.get("state");
  const password = formData.get("password");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  nanoid();
  try {
    const result = await pool.query(
      `INSERT INTO universities (
         name, location, approval_status, registered_officially
      ) VALUES ($1, $2, $3, $4)
      RETURNING id, name`,
      [collegeName, city, "Not_Approved", true]
    );
    const universityId = result.rows[0].id;
    const result1 = await pool.query(
      `INSERT INTO users (
         university_id, name, email, password_hash,role
      ) VALUES ($1, $2, $3, $4,$5)
      RETURNING id, name`,
      [universityId, firstName + " " + lastName, adminEmail, hashedPassword, "local_admin"]
    );
    console.log("result", result);
    return redirect("/sign-in");
  } catch (error) {
    console.error("Error inserting user data:", error);
    return json({
      error: "There was an issue creating your account."
    });
  }
};
function SignUpForm$1() {
  const actionData = useActionData();
  useState(null);
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen backdrop-blur-3xl bg-gradient-animation", children: /* @__PURE__ */ jsx("div", { className: "flex bg-gray-100 bg-opacity-80 rounded-3xl shadow-lg p-8 max-w-xl w-full", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center p-10", children: /* @__PURE__ */ jsxs(
    Form,
    {
      encType: "multipart/form-data",
      method: "post",
      className: "w-full max-w-lg font-sans",
      children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
            htmlFor: "firstName",
            children: "Admin Details"
          }
        ),
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap -mx-3 mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 px-3 mb-6 md:mb-0", children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
                htmlFor: "firstName",
                children: "First Name"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
                name: "firstName",
                id: "first-name",
                type: "text",
                placeholder: "First Name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 px-3", children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
                htmlFor: "lastName",
                children: "Last Name"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
                name: "lastName",
                id: "last-name",
                type: "text",
                placeholder: "Last Name"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap -mx-3 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full px-3", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
              htmlFor: "instituteDetails",
              children: "Institute Details"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
              name: "universityName",
              id: "university-name",
              type: "text",
              placeholder: "Enter University Name"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
              name: "Email",
              id: "university-email",
              type: "text",
              placeholder: "Enter Admin Email ID"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap -mx-3 mb-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 px-3 mb-6 md:mb-0", children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
                htmlFor: "city",
                children: "City"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-11 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
                name: "city",
                id: "city",
                type: "text",
                placeholder: "Your City"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 px-3 mb-6 md:mb-0", children: [
            /* @__PURE__ */ jsx(
              "label",
              {
                className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
                htmlFor: "state",
                children: "State"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "text-sm block appearance-none w-full bg-gray-50 border-gray-200 border py-3 px-4 h-11 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
                  name: "state",
                  id: "state",
                  defaultValue: "",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Select Your State" }),
                    /* @__PURE__ */ jsx("option", { value: "Andhra Pradesh", children: "Andhra Pradesh" }),
                    /* @__PURE__ */ jsx("option", { value: "Arunachal Pradesh", children: "Arunachal Pradesh" }),
                    /* @__PURE__ */ jsx("option", { value: "Assam", children: "Assam" }),
                    /* @__PURE__ */ jsx("option", { value: "Bihar", children: "Bihar" }),
                    /* @__PURE__ */ jsx("option", { value: "Chhattisgarh", children: "Chhattisgarh" }),
                    /* @__PURE__ */ jsx("option", { value: "Goa", children: "Goa" }),
                    /* @__PURE__ */ jsx("option", { value: "Gujarat", children: "Gujarat" }),
                    /* @__PURE__ */ jsx("option", { value: "Haryana", children: "Haryana" }),
                    /* @__PURE__ */ jsx("option", { value: "Himachal Pradesh", children: "Himachal Pradesh" }),
                    /* @__PURE__ */ jsx("option", { value: "Jharkhand", children: "Jharkhand" }),
                    /* @__PURE__ */ jsx("option", { value: "Karnataka", children: "Karnataka" }),
                    /* @__PURE__ */ jsx("option", { value: "Kerala", children: "Kerala" }),
                    /* @__PURE__ */ jsx("option", { value: "Madhya Pradesh", children: "Madhya Pradesh" }),
                    /* @__PURE__ */ jsx("option", { value: "Maharashtra", children: "Maharashtra" }),
                    /* @__PURE__ */ jsx("option", { value: "Manipur", children: "Manipur" }),
                    /* @__PURE__ */ jsx("option", { value: "Meghalaya", children: "Meghalaya" }),
                    /* @__PURE__ */ jsx("option", { value: "Mizoram", children: "Mizoram" }),
                    /* @__PURE__ */ jsx("option", { value: "Nagaland", children: "Nagaland" }),
                    /* @__PURE__ */ jsx("option", { value: "Odisha", children: "Odisha" }),
                    /* @__PURE__ */ jsx("option", { value: "Punjab", children: "Punjab" }),
                    /* @__PURE__ */ jsx("option", { value: "Rajasthan", children: "Rajasthan" }),
                    /* @__PURE__ */ jsx("option", { value: "Sikkim", children: "Sikkim" }),
                    /* @__PURE__ */ jsx("option", { value: "Tamil Nadu", children: "Tamil Nadu" }),
                    /* @__PURE__ */ jsx("option", { value: "Telangana", children: "Telangana" }),
                    /* @__PURE__ */ jsx("option", { value: "Tripura", children: "Tripura" }),
                    /* @__PURE__ */ jsx("option", { value: "Uttar Pradesh", children: "Uttar Pradesh" }),
                    /* @__PURE__ */ jsx("option", { value: "Uttarakhand", children: "Uttarakhand" }),
                    /* @__PURE__ */ jsx("option", { value: "West Bengal", children: "West Bengal" }),
                    /* @__PURE__ */ jsx("option", { value: "Andaman and Nicobar Islands", children: "Andaman and Nicobar Islands" }),
                    /* @__PURE__ */ jsx("option", { value: "Chandigarh", children: "Chandigarh" }),
                    /* @__PURE__ */ jsx("option", { value: "Dadra and Nagar Haveli and Daman and Diu", children: "Dadra and Nagar Haveli and Daman and Diu" }),
                    /* @__PURE__ */ jsx("option", { value: "Lakshadweep", children: "Lakshadweep" }),
                    /* @__PURE__ */ jsx("option", { value: "Delhi", children: "Delhi" }),
                    /* @__PURE__ */ jsx("option", { value: "Puducherry", children: "Puducherry" }),
                    /* @__PURE__ */ jsx("option", { value: "Ladakh", children: "Ladakh" }),
                    /* @__PURE__ */ jsx("option", { value: "Jammu and Kashmir", children: "Jammu and Kashmir" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700", children: /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "fill-current h-4 w-4",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  children: /* @__PURE__ */ jsx("path", { d: "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" })
                }
              ) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap -mx-3 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full px-3", children: [
          /* @__PURE__ */ jsx(
            "label",
            {
              className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
              htmlFor: "password",
              children: "Password"
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
              name: "password",
              id: "password",
              type: "password",
              placeholder: "Enter Password"
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-xs italic", children: [
            "Make sure your password is:",
            /* @__PURE__ */ jsx("br", {}),
            "- at least 8 characters long.",
            /* @__PURE__ */ jsx("br", {}),
            "- at least 1 Uppercase letter along with Lowercase.",
            /* @__PURE__ */ jsx("br", {}),
            "- contains a combination of alpha-numeric and special characters.",
            /* @__PURE__ */ jsx("br", {})
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "submit",
              className: "bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition",
              children: "Submit & Sign In"
            }
          ),
          (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-2", children: actionData.error }),
          (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("p", { className: "text-green-500 text-sm mt-2", children: actionData.success })
        ] })
      ]
    }
  ) }) }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: SignUpForm$1
}, Symbol.toStringTag, { value: "Module" }));
function validatePassword(password) {
  const minLength = /.{8,}/;
  const uppercase = /[A-Z]/;
  const lowercase = /[a-z]/;
  const alphanumeric = /[0-9]/;
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
  if (!minLength.test(password)) {
    return "Password must be at least 8 characters long.";
  }
  if (!uppercase.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!lowercase.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!alphanumeric.test(password)) {
    return "Password must contain at least one numeric character.";
  }
  if (!specialChar.test(password)) {
    return "Password must contain at least one special character.";
  }
  return null;
}
let loader$1 = async () => {
  try {
    const res = await pool.query(`SELECT id, name FROM universities`);
    return json({ University: res.rows });
  } catch (error) {
    return json({ error: "Failed to fetch universities" });
  }
};
const action$1 = async ({ request }) => {
  var _a, _b;
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const university = formData.get("university");
  const universityName = formData.get("universityName");
  const universityEmail = formData.get("universityEmail");
  const state = formData.get("state");
  const password = formData.get("password");
  const passwordError = validatePassword(password);
  if (passwordError) {
    return json({ error: passwordError });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  function getFullName(firstName2, lastName2) {
    return `${firstName2} ${lastName2}`;
  }
  try {
    const full_name = getFullName(firstName, lastName);
    let id_val;
    if (university) {
      const res = await pool.query(
        `SELECT id FROM universities WHERE name = $1`,
        [university]
      );
      id_val = (_a = res.rows[0]) == null ? void 0 : _a.id;
      if (!id_val) {
        return json({ error: "University not found" });
      }
    } else if (universityName) {
      const result1 = await pool.query(
        `INSERT INTO universities (name, location, approval_status, registered_officially) 
                 VALUES ($1, $2, $3, $4) RETURNING id`,
        [universityName, state, "Not_Approved", false]
      );
      id_val = (_b = result1.rows[0]) == null ? void 0 : _b.id;
      if (!id_val) {
        return json({ error: "Error adding university" });
      }
    } else {
      return json({ error: "Please select or enter a university" });
    }
    const result = await pool.query(
      `INSERT INTO users (university_id, name, email, password_hash, role)
             VALUES ($1, $2, $3, $4, $5) RETURNING id, email`,
      [id_val, full_name, universityEmail, hashedPassword, "student"]
    );
    const { id } = useParams();
    return redirect(`/dash/${id}`);
  } catch (error) {
    if (error.code === "23505" && error.detail.includes("Key (email)")) {
      return json({ error: "Email already exists" });
    }
    console.error("Error inserting user data:", error);
    return redirect("/404");
  }
};
function SignUpForm() {
  var _a;
  const loaderData = useLoaderData();
  const actionData = useActionData();
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen backdrop-blur-3xl bg-gradient-animation", children: /* @__PURE__ */ jsx("div", { className: "flex bg-gray-100 bg-opacity-80 rounded-3xl shadow-lg p-8 max-w-xl w-full", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center p-10", children: /* @__PURE__ */ jsxs(Form, { method: "post", className: "w-full max-w-lg font-sans", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap -mx-3 mb-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 px-3 mb-6 md:mb-0", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
            htmlFor: "firstName",
            children: "First Name"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
            name: "firstName",
            id: "first-name",
            type: "text",
            placeholder: "First Name"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 px-3", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
            htmlFor: "lastName",
            children: "Last Name"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
            name: "lastName",
            id: "last-name",
            type: "text",
            placeholder: "Last Name"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap -mx-3 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full px-3", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
          htmlFor: "instituteDetails",
          children: "Institute Details"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs(
          "select",
          {
            className: "text-sm block appearance-none w-full bg-gray-50 border-gray-200 border py-3 px-4 h-11 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
            name: "university",
            id: "university",
            defaultValue: "",
            children: [
              /* @__PURE__ */ jsx("option", { value: "", children: "Select Your University " }),
              (_a = loaderData.University) == null ? void 0 : _a.map((uni) => /* @__PURE__ */ jsx("option", { value: uni.name, children: uni.name }, uni.id))
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700",
            children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "fill-current h-4 w-4",
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 20 20",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                  }
                )
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsx("span", { className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2", children: "If your college is not registered with us" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
          name: "universityName",
          id: "university-name",
          type: "text",
          placeholder: "Enter University Name"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
          name: "universityEmail",
          id: "university-email",
          type: "text",
          placeholder: "Enter University Email ID"
        }
      ),
      (actionData == null ? void 0 : actionData.error) && actionData.error === "Email already exists" && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs italic", children: actionData.error }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
          name: "enrollmentId",
          id: "enrollment-id",
          type: "text",
          placeholder: "Enter Enrollement ID"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap -mx-3 mb-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 px-3 mb-6 md:mb-0", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
            htmlFor: "city",
            children: "City"
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-11 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
            name: "city",
            id: "city",
            type: "text",
            placeholder: "Your City"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 px-3 mb-6 md:mb-0", children: [
        /* @__PURE__ */ jsx(
          "label",
          {
            className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
            htmlFor: "state",
            children: "State"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxs(
            "select",
            {
              className: "text-sm block appearance-none w-full bg-gray-50 border-gray-200 border py-3 px-4 h-11 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
              name: "state",
              id: "state",
              defaultValue: "",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select Your State" }),
                /* @__PURE__ */ jsx("option", { value: "Andhra Pradesh", children: "Andhra Pradesh" }),
                /* @__PURE__ */ jsx("option", { value: "Arunachal Pradesh", children: "Arunachal Pradesh" }),
                /* @__PURE__ */ jsx("option", { value: "Assam", children: "Assam" }),
                /* @__PURE__ */ jsx("option", { value: "Bihar", children: "Bihar" }),
                /* @__PURE__ */ jsx("option", { value: "Chhattisgarh", children: "Chhattisgarh" }),
                /* @__PURE__ */ jsx("option", { value: "Goa", children: "Goa" }),
                /* @__PURE__ */ jsx("option", { value: "Gujarat", children: "Gujarat" }),
                /* @__PURE__ */ jsx("option", { value: "Haryana", children: "Haryana" }),
                /* @__PURE__ */ jsx("option", { value: "Himachal Pradesh", children: "Himachal Pradesh" }),
                /* @__PURE__ */ jsx("option", { value: "Jharkhand", children: "Jharkhand" }),
                /* @__PURE__ */ jsx("option", { value: "Karnataka", children: "Karnataka" }),
                /* @__PURE__ */ jsx("option", { value: "Kerala", children: "Kerala" }),
                /* @__PURE__ */ jsx("option", { value: "Madhya Pradesh", children: "Madhya Pradesh" }),
                /* @__PURE__ */ jsx("option", { value: "Maharashtra", children: "Maharashtra" }),
                /* @__PURE__ */ jsx("option", { value: "Manipur", children: "Manipur" }),
                /* @__PURE__ */ jsx("option", { value: "Meghalaya", children: "Meghalaya" }),
                /* @__PURE__ */ jsx("option", { value: "Mizoram", children: "Mizoram" }),
                /* @__PURE__ */ jsx("option", { value: "Nagaland", children: "Nagaland" }),
                /* @__PURE__ */ jsx("option", { value: "Odisha", children: "Odisha" }),
                /* @__PURE__ */ jsx("option", { value: "Punjab", children: "Punjab" }),
                /* @__PURE__ */ jsx("option", { value: "Rajasthan", children: "Rajasthan" }),
                /* @__PURE__ */ jsx("option", { value: "Sikkim", children: "Sikkim" }),
                /* @__PURE__ */ jsx("option", { value: "Tamil Nadu", children: "Tamil Nadu" }),
                /* @__PURE__ */ jsx("option", { value: "Telangana", children: "Telangana" }),
                /* @__PURE__ */ jsx("option", { value: "Tripura", children: "Tripura" }),
                /* @__PURE__ */ jsx("option", { value: "Uttar Pradesh", children: "Uttar Pradesh" }),
                /* @__PURE__ */ jsx("option", { value: "Uttarakhand", children: "Uttarakhand" }),
                /* @__PURE__ */ jsx("option", { value: "West Bengal", children: "West Bengal" }),
                /* @__PURE__ */ jsx("option", { value: "Andaman and Nicobar Islands", children: "Andaman and Nicobar Islands" }),
                /* @__PURE__ */ jsx("option", { value: "Chandigarh", children: "Chandigarh" }),
                /* @__PURE__ */ jsx("option", { value: "Dadra and Nagar Haveli and Daman and Diu", children: "Dadra and Nagar Haveli and Daman and Diu" }),
                /* @__PURE__ */ jsx("option", { value: "Lakshadweep", children: "Lakshadweep" }),
                /* @__PURE__ */ jsx("option", { value: "Delhi", children: "Delhi" }),
                /* @__PURE__ */ jsx("option", { value: "Puducherry", children: "Puducherry" }),
                /* @__PURE__ */ jsx("option", { value: "Ladakh", children: "Ladakh" }),
                /* @__PURE__ */ jsx("option", { value: "Jammu and Kashmir", children: "Jammu and Kashmir" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  className: "fill-current h-4 w-4",
                  xmlns: "http://www.w3.org/2000/svg",
                  viewBox: "0 0 20 20",
                  children: /* @__PURE__ */ jsx(
                    "path",
                    {
                      d: "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
                    }
                  )
                }
              )
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap -mx-3 mb-6", children: /* @__PURE__ */ jsxs("div", { className: "w-full px-3", children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
          htmlFor: "password",
          children: "Password"
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
          name: "password",
          id: "password",
          type: "password",
          placeholder: "Enter Password"
        }
      ),
      (actionData == null ? void 0 : actionData.error) && actionData.error !== "Email already exists" && actionData.error !== "There was an issue creating your account." && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-xs italic", children: actionData.error }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-xs italic", children: [
        "Make sure your password is:",
        /* @__PURE__ */ jsx("br", {}),
        "- at least 8 characters long.",
        /* @__PURE__ */ jsx("br", {}),
        "- at least 1 Uppercase letter along with Lowercase.",
        /* @__PURE__ */ jsx("br", {}),
        "- contains a combination of alpha-numeric and special characters.",
        /* @__PURE__ */ jsx("br", {})
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-center", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition",
          children: "Submit & Sign In"
        }
      ),
      (loaderData == null ? void 0 : loaderData.error) ? /* @__PURE__ */ jsxs("p", { children: [
        "ERROR: ",
        loaderData == null ? void 0 : loaderData.error
      ] }) : null,
      (loaderData == null ? void 0 : loaderData.success) && /* @__PURE__ */ jsx("p", { className: "text-green-500 text-sm mt-2", children: loaderData == null ? void 0 : loaderData.success })
    ] })
  ] }) }) }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: SignUpForm,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function Sidebar() {
  const { id } = useParams();
  return /* @__PURE__ */ jsx("div", { className: "w-64 bg-gray-200 text-white flex flex-col", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-col space-y-2 p-4", children: [
    /* @__PURE__ */ jsx(
      "a",
      {
        href: `/dash/${id}/community-operated`,
        className: "text-gray-700 hover:text-gray-500",
        children: "Community operated study material"
      }
    ),
    /* @__PURE__ */ jsx(
      "a",
      {
        href: "/404",
        className: "text-gray-700 hover:text-gray-500",
        children: "College operated study material"
      }
    )
  ] }) });
}
function handleLogout() {
  sessionStorage.removeItem("user");
}
function Navbar() {
  useNavigate();
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-gray-400/70 backdrop-blur-lg text-white h-[70px] p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4 text-lg font-bold", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/public/logo_UniNet_text.png",
        alt: "Uninet Logo",
        className: "h-8 w-[150px]"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsx("button", { className: "text-black hover:text-gray-500", children: "Profile" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleLogout,
          className: "text-black hover:text-gray-500",
          children: "Logout"
        }
      )
    ] })
  ] });
}
function DashboardLayout() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-screen", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-grow", children: [
      /* @__PURE__ */ jsx(Sidebar, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-grow p-4 bg-gray-100", children: /* @__PURE__ */ jsx(Outlet, {}) })
    ] })
  ] });
}
function Dashboard() {
  return /* @__PURE__ */ jsx(DashboardLayout, {});
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
const action = async ({ request, context }) => {
  const resp = await authenticator.authenticate("form", request, {
    successRedirect: "/dash/id",
    failureRedirect: "/sign-in",
    throwOnError: true,
    context
  });
  console.log(resp);
  return resp;
};
const loader = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dash/id"
  });
  const session = await sessionStorage$1.getSession(
    request.headers.get("Cookie")
  );
  const error = session.get("sessionErrorKey");
  return json({ error });
};
function LoginPage() {
  var _a;
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const loaderData = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen backdrop-blur-3xl bg-gradient-animation", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex bg-gray-100 bg-opacity-75 rounded-3xl shadow-lg p-8 max-w-6xl w-full transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-1/2 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center m-10", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "public/logo_UniNet_globe.png",
              alt: "Uni-Net Logo",
              className: "mb-6 max-w-sm mx-auto"
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "public/logo_UniNet_text.png",
              alt: "Company Text",
              className: "max-w-sm mx-auto"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "w-1/2 flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-center block tracking-wide text-gray-700 mb-10", children: "Sign In to Continue to UniNet" }),
          /* @__PURE__ */ jsxs("form", { method: "post", children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
                  htmlFor: "userId",
                  children: "User ID"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "email",
                  name: "email",
                  required: true,
                  placeholder: "Enter your user ID",
                  className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx(
                "label",
                {
                  className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
                  htmlFor: "password",
                  children: "Password"
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  name: "password",
                  placeholder: "Enter your password",
                  className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsx(
              "a",
              {
                href: "#",
                className: " hover:underline block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
                children: "Forgot Password?"
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center p-1", children: /* @__PURE__ */ jsx("button", { className: "bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition mr-1.5 w-full", children: "Sign In" }) }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center p-1", children: /* @__PURE__ */ jsx(
              "button",
              {
                className: "border border-black bg-white text-black px-4 py-2 rounded-3xl hover:bg-gray-100 transition mr-1.5 w-full ",
                onClick: () => {
                  window.location.href = "/sign-up-student";
                },
                children: "Sign Up as Student"
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-center p-1", children: /* @__PURE__ */ jsx(
              "button",
              {
                className: "border border-black bg-white text-black px-4 py-2 rounded-3xl hover:bg-gray-100 transition mr-1.5 w-full",
                onClick: () => {
                  window.location.href = "/sign-up-college";
                },
                children: "Sign Up as College"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("div", { children: (loaderData == null ? void 0 : loaderData.error) ? /* @__PURE__ */ jsxs("p", { children: [
            "ERROR: ",
            (_a = loaderData == null ? void 0 : loaderData.error) == null ? void 0 : _a.message
          ] }) : null })
        ] }) })
      ]
    }
  ) });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: LoginPage,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const HelloText = () => {
  const textRef = useRef(null);
  useEffect(() => {
    var _a;
    const text = textRef.current;
    if (text) {
      const chars = (_a = text.textContent) == null ? void 0 : _a.split("");
      text.textContent = "";
      chars == null ? void 0 : chars.forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? " " : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        text.appendChild(span);
      });
      gsap.fromTo(
        text.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1
          // Stagger animation for each character
        }
      );
    }
  }, []);
  return /* @__PURE__ */ jsx("div", { style: { textAlign: "center", fontFamily: "cursive", fontSize: "4rem", color: "#000" }, children: /* @__PURE__ */ jsx("span", { ref: textRef, children: "Hello!" }) });
};
function NotFound() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    ).fromTo(
      textRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "bounce.out" }
    ).fromTo(
      imageRef.current,
      { scale: 0 },
      { scale: 1, duration: 1, ease: "elastic.out(1, 0.3)" }
    );
    gsap.to(imageRef.current, {
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "none",
      keyframes: [
        { x: 100, y: -100 },
        { x: 200, y: 0 },
        { x: 300, y: 100 },
        { x: 400, y: 0 },
        { x: 300, y: -100 },
        { x: 200, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 0 }
      ]
    });
  }, []);
  return /* @__PURE__ */ jsxs("div", { ref: containerRef, className: "flex flex-col items-center justify-center min-h-screen bg-gray-100", children: [
    /* @__PURE__ */ jsx("h1", { ref: textRef, className: "text-6xl font-bold mb-4", children: "404" }),
    /* @__PURE__ */ jsx("div", { className: "", children: /* @__PURE__ */ jsx("img", { ref: imageRef, src: "/public/404.png", alt: "404 Not Found", className: "w-1/2 h-auto mb-8" }) }),
    /* @__PURE__ */ jsx("p", { className: "text-lg mb-8", children: "Sorry, the page you are looking for does not exist." }),
    /* @__PURE__ */ jsx(Link, { to: "/", className: "text-blue-500 hover:underline", children: "Go back to the homepage" })
  ] });
}
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NotFound
}, Symbol.toStringTag, { value: "Module" }));
const App = () => {
  const helloRef = useRef(null);
  const welcomeRef = useRef(null);
  const navigate = useNavigate$1();
  useEffect(() => {
    const helloElement = helloRef.current;
    const welcomeElement = welcomeRef.current;
    if (!helloElement || !welcomeElement) return;
    gsap.set(welcomeElement, { opacity: 0, display: "none" });
    const timeline = gsap.timeline();
    timeline.to(helloElement, { opacity: 0, duration: 1, delay: 2 }).to(helloElement, { display: "none" }).set(welcomeElement, { display: "flex" }).to(welcomeElement, { opacity: 1, duration: 2, delay: 1 }).to(welcomeElement, { opacity: 0, duration: 2, delay: 1, onComplete: () => {
      navigate("/sign-in");
    } });
    return () => {
    };
  }, [navigate]);
  return /* @__PURE__ */ jsxs("div", { className: "bg-gradient-animation", style: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
    // Stack items vertically
  }, children: [
    /* @__PURE__ */ jsx("div", { ref: helloRef, children: /* @__PURE__ */ jsx(HelloText, {}) }),
    /* @__PURE__ */ jsx("div", { ref: welcomeRef, className: "flex justify-center items-center h-screen  font-mono w-full whitespace-nowrap overflow-hidden", style: { fontFamily: "cursive", fontSize: "4rem" }, children: "Welcome to UniNet!" })
  ] });
};
const CatchBoundary = () => {
  return /* @__PURE__ */ jsx(NotFound, {});
};
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CatchBoundary,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CawMMEbP.js", "imports": ["/assets/index-DoaAZ6RU.js", "/assets/components-CrS9CztZ.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-D3zR4soS.js", "imports": ["/assets/index-DoaAZ6RU.js", "/assets/components-CrS9CztZ.js"], "css": ["/assets/root-nBL1rjIG.css"] }, "routes/dash._student.$id.community-operated": { "id": "routes/dash._student.$id.community-operated", "parentId": "routes/dash._student.$id", "path": "community-operated", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dash._student._id.community-operated-DlqrwcwT.js", "imports": ["/assets/index-DoaAZ6RU.js"], "css": [] }, "routes/dash._student.$id.upload-material": { "id": "routes/dash._student.$id.upload-material", "parentId": "routes/dash._student.$id", "path": "upload-material", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dash._student._id.upload-material-CUflLEwL.js", "imports": ["/assets/index-DoaAZ6RU.js", "/assets/components-CrS9CztZ.js"], "css": [] }, "routes/_auth.sign-up-college": { "id": "routes/_auth.sign-up-college", "parentId": "root", "path": "sign-up-college", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-up-college-COuOYsTd.js", "imports": ["/assets/index-DoaAZ6RU.js", "/assets/components-CrS9CztZ.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/_auth.sign-up-student": { "id": "routes/_auth.sign-up-student", "parentId": "root", "path": "sign-up-student", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-up-student-pWk-EAHZ.js", "imports": ["/assets/index-DoaAZ6RU.js", "/assets/components-CrS9CztZ.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/dash._student.$id": { "id": "routes/dash._student.$id", "parentId": "root", "path": "dash/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dash._student._id-BB7tr9SB.js", "imports": ["/assets/index-DoaAZ6RU.js"], "css": [] }, "routes/_auth.sign-in": { "id": "routes/_auth.sign-in", "parentId": "root", "path": "sign-in", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-in-uNBSEC7J.js", "imports": ["/assets/index-DoaAZ6RU.js", "/assets/components-CrS9CztZ.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-XBADPTYd.js", "imports": ["/assets/index-DoaAZ6RU.js", "/assets/index-DjKJqAo0.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/404": { "id": "routes/404", "parentId": "root", "path": "404", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/404-B1dH8qYw.js", "imports": ["/assets/index-DoaAZ6RU.js", "/assets/index-DjKJqAo0.js", "/assets/components-CrS9CztZ.js"], "css": [] } }, "url": "/assets/manifest-f47ce824.js", "version": "f47ce824" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "unstable_singleFetch": false, "unstable_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/dash._student.$id.community-operated": {
    id: "routes/dash._student.$id.community-operated",
    parentId: "routes/dash._student.$id",
    path: "community-operated",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/dash._student.$id.upload-material": {
    id: "routes/dash._student.$id.upload-material",
    parentId: "routes/dash._student.$id",
    path: "upload-material",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_auth.sign-up-college": {
    id: "routes/_auth.sign-up-college",
    parentId: "root",
    path: "sign-up-college",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_auth.sign-up-student": {
    id: "routes/_auth.sign-up-student",
    parentId: "root",
    path: "sign-up-student",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/dash._student.$id": {
    id: "routes/dash._student.$id",
    parentId: "root",
    path: "dash/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/_auth.sign-in": {
    id: "routes/_auth.sign-in",
    parentId: "root",
    path: "sign-in",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route7
  },
  "routes/404": {
    id: "routes/404",
    parentId: "root",
    path: "404",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
