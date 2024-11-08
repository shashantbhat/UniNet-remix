import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json, redirect, createCookieSessionStorage } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useLoaderData, Form } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import pg from "pg";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { useState, useEffect, useRef } from "react";
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
dotenv.config();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});
const action$1 = async ({ request }) => {
  const formData = await request.formData();
  const collegeName = formData.get("collegeName");
  formData.get("universityName");
  formData.get("city");
  const state = formData.get("state");
  const id_val = nanoid();
  try {
    const result = await pool.query(
      `INSERT INTO Universities (
                id, name, location, Approval Status, Registered 
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, Approval Status`,
      [id_val, collegeName, state, null, true]
      // as college is getting officially reg
    );
    console.log("result", result);
    json({ success: "Your account was created successfully." });
    return redirect("/sign-in");
  } catch (error) {
    console.error("Error inserting user data:", error);
    return json({ error: "There was an issue creating your account." });
  }
};
function SignUpForm$1() {
  const loaderData = useLoaderData();
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen backdrop-blur-3xl bg-gradient-animation", children: /* @__PURE__ */ jsx("div", { className: "flex bg-gray-100 bg-opacity-80 rounded-3xl shadow-lg p-8 max-w-xl w-full", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center p-10", children: /* @__PURE__ */ jsxs(Form, { encType: "multipart/form-data", method: "post", className: "w-full max-w-lg font-sans", children: [
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
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: SignUpForm$1
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async ({ request }) => {
  var _a;
  const formData = await request.formData();
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const collegeName = formData.get("collegeName");
  const universityEmail = formData.get("universityEmail");
  const state = formData.get("state");
  const password = formData.get("password");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const id_val = nanoid();
  function getFullName(firstName2, lastName2) {
    const fullName = `${firstName2} ${lastName2}`;
    return fullName;
  }
  try {
    const res = await pool.query(
      `SELECT id FROM Universities 
                WHERE university_name = $1 AND city = $2`,
      [collegeName, state]
    );
    const uni_id = (_a = res.rows[0]) == null ? void 0 : _a.id;
    const full_name = getFullName(firstName, lastName);
    const result = await pool.query(
      `INSERT INTO Users (
                id, university_id, name, email, password_hash, role
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, email`,
      [id_val, uni_id, full_name, universityEmail, hashedPassword, "student"]
    );
    console.log("result", result);
    json({ success: "There was an issue creating your account." });
    return redirect("/sign-in");
  } catch (error) {
    console.error("Error inserting user data:", error);
    return json({ error: "There was an issue creating your account." });
  }
};
function SignUpForm() {
  const loaderData = useLoaderData();
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
        /* @__PURE__ */ jsx(
          "select",
          {
            className: "text-sm block appearance-none w-full bg-gray-50 border-gray-200 border py-3 px-4 h-11 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100",
            name: "state",
            id: "state",
            defaultValue: "",
            children: /* @__PURE__ */ jsx("option", { value: "", children: "Select Your College" })
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
      /* @__PURE__ */ jsx("span", { className: "italic text-sm", children: "If your college is not registered with us" }),
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
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: SignUpForm,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
let sessionStorage = createCookieSessionStorage({
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
const authenticator = new Authenticator(sessionStorage, {
  sessionKey: "sessionKey",
  // keep in sync
  sessionErrorKey: "sessionErrorKey"
  // keep in sync
});
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");
    if (!email || (email == null ? void 0 : email.length) === 0) throw new AuthorizationError("Bad Credentials: Email is required");
    if (typeof email !== "string")
      throw new AuthorizationError("Bad Credentials: Email must be a string");
    if (!password || (password == null ? void 0 : password.length) === 0) throw new AuthorizationError("Bad Credentials: Password is required");
    if (typeof password !== "string")
      throw new AuthorizationError("Bad Credentials: Password must be a string");
    const client = await pool.connect();
    try {
      const res = await client.query("SELECT * FROM users WHERE email = $1", [email]);
      const user2 = res.rows[0];
      console.log(user2);
      if (user2 && await bcrypt.compare(password, user2.password_hash)) {
        return { name: user2.name, token: `${user2.id}-${(/* @__PURE__ */ new Date()).getTime()}` };
      } else {
        throw new AuthorizationError("Bad Credentials");
      }
    } finally {
      client.release();
    }
  })
);
const action = async ({ request, context }) => {
  const resp = await authenticator.authenticate("form", request, {
    successRedirect: "https://www.google.com",
    failureRedirect: "/sign-in",
    throwOnError: true,
    context
  });
  console.log(resp);
  return resp;
};
const loader = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "https://www.google.com"
  });
  const session = await sessionStorage.getSession(
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
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
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
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-DmZLDtZ3.js", "imports": ["/assets/index-BNk6GJTt.js", "/assets/components-ByyFvqx2.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BqBd0wyB.js", "imports": ["/assets/index-BNk6GJTt.js", "/assets/components-ByyFvqx2.js"], "css": ["/assets/root-DZGzzuU5.css"] }, "routes/_auth.sign-up-college": { "id": "routes/_auth.sign-up-college", "parentId": "root", "path": "sign-up-college", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-up-college-Qs6xD21x.js", "imports": ["/assets/index-BNk6GJTt.js", "/assets/components-ByyFvqx2.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/_auth.sign-up-student": { "id": "routes/_auth.sign-up-student", "parentId": "root", "path": "sign-up-student", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-up-student-C5ROQD3M.js", "imports": ["/assets/index-BNk6GJTt.js", "/assets/components-ByyFvqx2.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/_auth.sign-in": { "id": "routes/_auth.sign-in", "parentId": "root", "path": "sign-in", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-in-7wenSho_.js", "imports": ["/assets/index-BNk6GJTt.js", "/assets/components-ByyFvqx2.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-DB3CEApB.js", "imports": ["/assets/index-BNk6GJTt.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] } }, "url": "/assets/manifest-b8c6e258.js", "version": "b8c6e258" };
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
  "routes/_auth.sign-up-college": {
    id: "routes/_auth.sign-up-college",
    parentId: "root",
    path: "sign-up-college",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/_auth.sign-up-student": {
    id: "routes/_auth.sign-up-student",
    parentId: "root",
    path: "sign-up-student",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_auth.sign-in": {
    id: "routes/_auth.sign-in",
    parentId: "root",
    path: "sign-in",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route4
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
