import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, redirect, json } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useActionData, Form } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect, useRef } from "react";
import bcrypt from "bcrypt";
import pkg from "pg";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
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
const FormComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
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
          /* @__PURE__ */ jsxs("form", { children: [
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
                  id: "userId",
                  type: "text",
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
                  id: "password",
                  type: "password",
                  placeholder: "Enter your password",
                  className: "text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between mb-4", children: /* @__PURE__ */ jsx("a", { href: "#", className: " hover:underline block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2", children: "Forgot Password?" }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-center", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition mr-1.5",
                  formAction: "sign-up",
                  children: "Sign Up"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition ml-1.5",
                  children: "Sign In"
                }
              )
            ] })
          ] })
        ] }) })
      ]
    }
  ) });
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: FormComponent
}, Symbol.toStringTag, { value: "Module" }));
const { Pool } = pkg;
const pool = new Pool({
  user: "shash",
  host: "localhost",
  database: "uninet",
  password: "shash@2004",
  port: 5432
});
const createTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS  (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        college_name VARCHAR(100),
        university_name VARCHAR(100),
        university_email VARCHAR(100),
        enrollment_id VARCHAR(50),
        college_id BYTEA,
        city VARCHAR(50),
        state VARCHAR(50),
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log("Users table created successfully or already exists.");
  } catch (error) {
    console.error("Error creating table:", error.message || error);
  }
};
createTable();
const action = async ({ request }) => {
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const collegeName = formData.get("collegeName");
  const universityName = formData.get("universityName");
  const universityEmail = formData.get("universityEmail");
  const enrollmentId = formData.get("enrollmentId");
  const collegeId = formData.get("collegeId");
  const city = formData.get("city");
  const state = formData.get("state");
  const password = formData.get("password");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const collegeIdBuffer = collegeId instanceof Blob ? Buffer.from(await collegeId.arrayBuffer()) : null;
  try {
    const result = await pool.query(
      `INSERT INTO users (
                first_name, last_name, college_name, university_name, university_email, enrollment_id, college_id, city, state, password
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, university_email`,
      [firstName, lastName, collegeName, universityName, universityEmail, enrollmentId, collegeIdBuffer, city, state, hashedPassword]
    );
    console.log("result", result);
    return redirect("/sign-in");
  } catch (error) {
    console.error("Error inserting user data:", error);
    return json({ error: "There was an issue creating your account." });
  }
};
function SignUpForm() {
  const actionData = useActionData();
  const [preview, setPreview] = useState(null);
  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveFile = () => {
    setPreview(null);
  };
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen backdrop-blur-3xl bg-gradient-animation", children: /* @__PURE__ */ jsx("div", { className: "flex bg-gray-100 bg-opacity-80 rounded-3xl shadow-lg p-8 max-w-xl w-full", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center p-10", children: /* @__PURE__ */ jsxs(Form, { encType: "multipart/form-data", method: "post", className: "w-full max-w-lg font-sans", children: [
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
          name: "collegeName",
          id: "college-name",
          type: "text",
          placeholder: "Enter College Name"
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
          name: "universityEmail",
          id: "university-email",
          type: "text",
          placeholder: "Enter University Email ID"
        }
      ),
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
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        "label",
        {
          className: "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2",
          htmlFor: "collegeId",
          children: "College ID"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center w-full h-28 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center pt-5 pb-6", children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: "w-8 h-8 mb-4 text-gray-500",
              "aria-hidden": "true",
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 20 16",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  stroke: "currentColor",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "mb-2 text-sm text-gray-500", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Click to upload" }),
            " or drag and drop"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "SVG, PNG, JPG or GIF (MAX. 800x400px)" })
        ] }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "dropzone-file",
            name: "collegeId",
            type: "file",
            className: "hidden",
            accept: "image/*",
            onChange: handleFileChange
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition my-3",
          children: "Upload"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: preview && /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: preview,
            alt: "Uploaded Preview",
            className: "h-32 w-auto object-contain rounded-md border"
          }
        ) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "mt-2 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 my-3",
            onClick: handleRemoveFile,
            children: "Remove File"
          }
        )
      ] }) })
    ] }),
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
          formAction: "sign-in",
          children: "Submit & Sign In"
        }
      ),
      (actionData == null ? void 0 : actionData.error) && /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm mt-2", children: actionData.error }),
      (actionData == null ? void 0 : actionData.success) && /* @__PURE__ */ jsx("p", { className: "text-green-500 text-sm mt-2", children: actionData.success })
    ] })
  ] }) }) }) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: SignUpForm
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
const App = () => {
  const helloRef = useRef(null);
  const welcomeRef = useRef(null);
  const navigate = useNavigate();
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
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CMk_jrhq.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-j7OKG51C.js", "/assets/index-qfmGOeiF.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-D4aiLaf7.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-j7OKG51C.js", "/assets/index-qfmGOeiF.js"], "css": ["/assets/root-VLWJ-NQF.css"] }, "routes/_auth.sign-in": { "id": "routes/_auth.sign-in", "parentId": "root", "path": "sign-in", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-in-BkEYYlcM.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/_auth.sign-up": { "id": "routes/_auth.sign-up", "parentId": "root", "path": "sign-up", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-up-ciduWXs_.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/components-j7OKG51C.js", "/assets/index-qfmGOeiF.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-B6iToYgY.js", "imports": ["/assets/jsx-runtime-56DGgGmo.js", "/assets/index-qfmGOeiF.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] } }, "url": "/assets/manifest-fbddf64d.js", "version": "fbddf64d" };
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
  "routes/_auth.sign-in": {
    id: "routes/_auth.sign-in",
    parentId: "root",
    path: "sign-in",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_auth.sign-up": {
    id: "routes/_auth.sign-up",
    parentId: "root",
    path: "sign-up",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
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
