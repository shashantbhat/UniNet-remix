import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useLoaderData, useParams, Form, useActionData, useNavigate as useNavigate$1, useLocation, Link } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useRef, useEffect } from "react";
import pg from "pg";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { BlobServiceClient } from "@azure/storage-blob";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { nanoid } from "nanoid";
import { AnimatePresence, motion, useMotionValue, useMotionTemplate } from "framer-motion";
import * as HoverCard from "@radix-ui/react-hover-card";
import { gsap } from "gsap";
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
let { getSession, commitSession, destroySession } = sessionStorage;
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
const DropdownMenu = ({
  tags,
  selectedTags,
  onSelectTag
}) => {
  return /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 mt-2 w-full bg-white border border-gray-300 rounded-xl text-sm shadow-lg z-50", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center px-2 pt-4", children: /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Search using tags:" }) }),
    /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap py-2", children: tags.map((tag) => /* @__PURE__ */ jsx(
      "li",
      {
        className: `px-3 py-1 m-1 hover:bg-gray-400 bg-gray-200 cursor-pointer rounded-full ${selectedTags.includes(tag.id) ? "bg-gray-400" : ""}`,
        onClick: () => onSelectTag(tag.id),
        children: tag.name
      },
      tag.id
    )) })
  ] });
};
const AdvancedSearchModal = ({
  tags,
  isOpen,
  onClose
}) => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [relevanceScores, setRelevanceScores] = useState({});
  const handleTagSelection = (tagId) => {
    setSelectedTags(
      (prevSelectedTags) => prevSelectedTags.includes(tagId) ? prevSelectedTags.filter((id) => id !== tagId) : [...prevSelectedTags, tagId]
    );
  };
  const handleRelevanceScoreChange = (tagId, score) => {
    setRelevanceScores((prevScores) => ({
      ...prevScores,
      [tagId]: score
    }));
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-6 w-1/3", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-4", children: "Advanced Search" }),
    /* @__PURE__ */ jsx("hr", {}),
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold mb-4 pt-4", children: "Enter Prompt (AI Tag Analysis)" }),
    /* @__PURE__ */ jsx("form", { children: /* @__PURE__ */ jsx("div", { className: "flex items-center mb-2 w-full", children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        className: "rounded-xl bg-gray-100 w-full h-auto p-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-black transition-all hover:border-black duration-200",
        placeholder: "Enter prompt"
      }
    ) }) }),
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold mb-4 pt-4", children: "Search using tags:" }),
    /* @__PURE__ */ jsxs("form", { children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap", children: tags.map((tag) => /* @__PURE__ */ jsx("div", { className: "flex items-center mb-2", children: /* @__PURE__ */ jsx(
        "div",
        {
          className: `px-3 py-1 m-1 hover:bg-gray-400 bg-gray-200 cursor-pointer rounded-full ${selectedTags.includes(tag.id) ? "bg-gray-400" : ""}`,
          onClick: () => handleTagSelection(tag.id),
          children: tag.name
        }
      ) }, tag.id)) }),
      /* @__PURE__ */ jsx("hr", {}),
      /* @__PURE__ */ jsx("div", { className: "mt-4", children: selectedTags.map((tagId) => {
        const tag = tags.find((t) => t.id === tagId);
        return /* @__PURE__ */ jsxs("div", { className: "flex items-center mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1/2", children: /* @__PURE__ */ jsx("span", { className: " mr-2 px-3 py-1 bg-gray-200 cursor-pointer rounded-full", children: tag == null ? void 0 : tag.name }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: "0",
              max: "1",
              step: "0.01",
              value: relevanceScores[tagId] || 0,
              onChange: (e) => handleRelevanceScoreChange(
                tagId,
                parseFloat(e.target.value)
              ),
              className: "slider ml-2"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "ml-2", children: relevanceScores[tagId] || 0 })
        ] }, tagId);
      }) }),
      /* @__PURE__ */ jsx("div", { className: "flex justify-end mt-4", children: /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "border border-black bg-white text-black px-4 py-2 rounded-xl hover:bg-black hover:text-white transition",
          onClick: onClose,
          children: "Close"
        }
      ) })
    ] })
  ] }) });
};
const loader$4 = async ({ request }) => {
  const client = await pool.connect();
  try {
    const user = await authenticator.isAuthenticated(request);
    if (!user) {
      throw new Error("User not authenticated");
    }
    const universityId = user == null ? void 0 : user.university_id;
    const filesResult = await client.query(
      "SELECT * FROM files WHERE university_id = $1",
      [universityId]
    );
    const tagsResult = await client.query("SELECT * FROM file_tags");
    const fileTagAssignmentsResult = await client.query(
      "SELECT * FROM file_tag_assignments"
    );
    return json({
      files: filesResult.rows,
      tags: tagsResult.rows,
      fileTagAssignments: fileTagAssignmentsResult.rows
    });
  } catch (error) {
    console.error("Error fetching files or tags:", error);
    return json({ error: "Failed to fetch files or tags" }, { status: 500 });
  } finally {
    client.release();
  }
};
const CommunityOperated = () => {
  const { files, tags, fileTagAssignments } = useLoaderData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();
  const dropdownRef = useRef(null);
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleSelectTag = (tagId) => {
    setSelectedTags(
      (prevSelectedTags) => prevSelectedTags.includes(tagId) ? prevSelectedTags.filter((id2) => id2 !== tagId) : [...prevSelectedTags, tagId]
    );
  };
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const filteredFiles = files == null ? void 0 : files.filter((file) => {
    const fileTags = fileTagAssignments.filter((assignment) => assignment.file_id === file.id).map((assignment) => assignment.tag_id);
    return file.title.toLowerCase().includes(searchQuery.toLowerCase()) && (selectedTags.length === 0 || selectedTags.every((tagId) => fileTags.includes(tagId)));
  });
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-screen p-4", children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `flex flex-col gap-4 bg-gray-100 bg-opacity-75 rounded-3xl shadow-lg p-6 w-full transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center w-full", children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                className: "flex items-center gap-2 border border-black bg-white text-black hover:bg-black hover:text-white py-2.5 px-4 rounded-xl text-sm font-medium transition",
                onClick: () => {
                  window.location.href = `/dash/${id}/upload-material`;
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "svg",
                    {
                      xmlns: "http://www.w3.org/2000/svg",
                      width: "20",
                      height: "20",
                      fill: "currentColor",
                      viewBox: "0 0 256 256",
                      children: /* @__PURE__ */ jsx("path", { d: "M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-40-64a8,8,0,0,1-8,8H136v16a8,8,0,0,1-16,0V160H104a8,8,0,0,1,0-16h16V128a8,8,0,0,1,16,0v16h16A8,8,0,0,1,160,152Z" })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "Add File" })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  className: "flex items-center gap-2 border border-black bg-white text-black hover:bg-black hover:text-white py-2.5 px-4 rounded-xl text-sm font-medium transition",
                  onClick: () => setIsModalOpen(true),
                  children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        xmlns: "http://www.w3.org/2000/svg",
                        width: "20",
                        height: "20",
                        fill: "currentColor",
                        viewBox: "0 0 256 256",
                        children: /* @__PURE__ */ jsx("path", { d: "M32,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H40A8,8,0,0,1,32,64Zm8,72h72a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16Zm88,48H40a8,8,0,0,0,0,16h88a8,8,0,0,0,0-16Zm109.66,13.66a8,8,0,0,1-11.32,0L206,177.36A40,40,0,1,1,217.36,166l20.3,20.3A8,8,0,0,1,237.66,197.66ZM184,168a24,24,0,1,0-24-24A24,24,0,0,0,184,168Z" })
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: "Adv Search" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { ref: dropdownRef, className: "relative flex items-center gap-2 w-1/3 min-w-[400px]", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Search files",
                    value: searchQuery,
                    onChange: handleSearchChange,
                    onClick: handleSearchClick,
                    className: "w-full py-2.5 px-4 rounded-xl text-sm font-medium focus:outline-none focus:ring-1 focus:ring-black transition-all hover:border-black duration-200"
                  }
                ),
                isDropdownOpen && /* @__PURE__ */ jsx(
                  DropdownMenu,
                  {
                    tags,
                    selectedTags,
                    onSelectTag: handleSelectTag
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsxs("table", { className: "min-w-full bg-white table-fixed", children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "h-12", children: [
              " ",
              /* @__PURE__ */ jsx("th", { className: "py-2 px-4 border-b text-center w-40", children: "File Name" }),
              /* @__PURE__ */ jsx("th", { className: "py-2 px-4 border-b text-center w-64", children: "Description" }),
              /* @__PURE__ */ jsx("th", { className: "py-2 px-4 border-b text-center w-36", children: "Upload Date" }),
              /* @__PURE__ */ jsx("th", { className: "py-2 px-4 border-b text-center w-32", children: "Average Rating" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: filteredFiles == null ? void 0 : filteredFiles.map((file) => /* @__PURE__ */ jsxs("tr", { className: "h-10", children: [
              " ",
              /* @__PURE__ */ jsx("td", { className: "py-2 px-2 border-b text-center w-40 truncate", children: /* @__PURE__ */ jsx(
                "a",
                {
                  href: `/dash/id/files/${file.id}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: "text-blue-500 hover:text-black",
                  children: file.title
                }
              ) }),
              /* @__PURE__ */ jsx("td", { className: "py-2 px-2 border-b text-center w-64", children: /* @__PURE__ */ jsx("span", { className: "line-clamp-1", children: file.description }) }),
              /* @__PURE__ */ jsx("td", { className: "py-2 px-2 border-b text-center w-36 truncate", children: new Date(file.upload_date).toLocaleDateString() }),
              /* @__PURE__ */ jsxs("td", { className: "py-2 px-2 border-b text-center w-32 truncate", children: [
                file.average_rating.toFixed(1),
                " ★"
              ] })
            ] }, file.id)) })
          ] }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      AdvancedSearchModal,
      {
        tags,
        selectedTags,
        onSelectTag: handleSelectTag,
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false)
      }
    )
  ] });
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: CommunityOperated,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
let loader$3 = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/sign-in"
  });
  const client = await pool.connect();
  const result = await client.query("SELECT * FROM file_tags");
  const tags = result.rows;
  return json({ user, tags });
};
const action$5 = async ({ request }) => {
  var _a, _b;
  try {
    const formData = await request.formData();
    const title = (_a = formData.get("title")) == null ? void 0 : _a.toString();
    const description = (_b = formData.get("description")) == null ? void 0 : _b.toString();
    const file = formData.get("file");
    const tags = formData.getAll("tags").map((tag) => tag.toString());
    if (!file || !title || tags.length === 0) {
      throw new Error("Missing required fields");
    }
    const { id: uploaderId, university_id: universityId } = await authenticator.isAuthenticated(request);
    const accountName = "uninetfilestorage";
    const sasToken = "sp=racwdli&st=2025-02-25T14:48:01Z&se=2026-06-15T22:48:01Z&sip=0.0.0.0-255.255.255.255&sv=2022-11-02&sr=c&sig=5nKLpwpwwlXWw72EgaXUV%2BBp7NfDPgkjOZXrvllT76s%3D";
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
    const tagQuery = `
      INSERT INTO file_tag_assignments (file_id, tag_id, relevance_score)
      VALUES ($1, $2, $3)
    `;
    const fileQuery = `
      SELECT id FROM files WHERE file_url = $1
    `;
    const fileValues = [fileUrl];
    const fileResult = await pool.query(fileQuery, fileValues);
    const fileId = fileResult.rows[0].id;
    for (const tag of tags) {
      const tag_id_query = `
      SELECT id FROM file_tags WHERE name = $1
    `;
      const tag_id = await pool.query(tag_id_query, [tag]);
      if (tag_id.rows.length === 0) {
        const new_tag_query = `
          INSERT INTO file_tags (name) VALUES ($1)
          RETURNING id
        `;
        const new_tag_values = [tag];
        const new_tag_result = await pool.query(new_tag_query, new_tag_values);
        tag_id.rows.push(new_tag_result.rows[0]);
      }
      console.log(tag_id);
      const tagQueryValues = [fileId, tag_id.rows[0].id, 1];
      await pool.query(tagQuery, tagQueryValues);
    }
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
  const { user, tags } = useLoaderData();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: []
  });
  const [newTag, setNewTag] = useState("");
  const handleFileUpload = (event) => {
    if (event.target.files) {
      setFiles([...files, ...Array.from(event.target.files)]);
    }
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleTagChange = (event) => {
    const selectedTag = event.target.value;
    if (selectedTag && !formData.tags.includes(selectedTag)) {
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, selectedTag]
      }));
    }
  };
  const handleNewTagChange = (event) => {
    setNewTag(event.target.value);
  };
  const addNewTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, newTag]
      }));
      setNewTag("");
    }
  };
  const removeTag = (tagToRemove) => {
    setFormData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((tag) => tag !== tagToRemove)
    }));
  };
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formData.tags.forEach((tag) => formDataToSend.append("tags", tag));
      files.forEach((file) => formDataToSend.append("file", file));
      const response = await fetch("", {
        method: "POST",
        body: formDataToSend
      });
      if (!response.ok) {
        throw new Error("Failed to upload file or save metadata");
        navigate("/404");
      }
      alert("File uploaded and metadata saved successfully!");
      navigate(`/dash/{$id}/community-operated`);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload file or save metadata.");
      navigate("/404");
    } finally {
      setUploading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "flex flex-col h-screen p-4", children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: `flex flex-col gap-6 bg-gray-50 bg-opacity-90 rounded-3xl shadow-2xl p-8 w-full transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "Study Material" }) }),
        /* @__PURE__ */ jsxs(
          "form",
          {
            onSubmit: handleSubmit,
            className: "bg-white rounded-2xl p-6 shadow-md",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Title" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    name: "title",
                    value: formData.title,
                    onChange: handleInputChange,
                    required: true,
                    className: "block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Description" }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    name: "description",
                    value: formData.description,
                    onChange: handleInputChange,
                    className: "block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Tag" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxs(
                    "select",
                    {
                      name: "tag",
                      value: "",
                      onChange: handleTagChange,
                      className: "block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3",
                      children: [
                        /* @__PURE__ */ jsx("option", { value: "", children: "Select a tag" }),
                        tags.map((tag) => /* @__PURE__ */ jsx("option", { value: tag.name, children: tag.name }, tag.id))
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: newTag,
                      onChange: handleNewTagChange,
                      placeholder: "New tag name",
                      className: "block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: addNewTag,
                      className: "border border-black bg-white text-black hover:bg-black hover:text-white transition px-4 py-2 rounded-lg",
                      children: "Add"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Selected Tags" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: formData.tags.map((tag) => /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full",
                    children: [
                      /* @__PURE__ */ jsx("span", { children: tag }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => removeTag(tag),
                          className: "ml-2 text-gray-500 hover:text-gray-700",
                          children: "×"
                        }
                      )
                    ]
                  },
                  tag
                )) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
                /* @__PURE__ */ jsx("label", { className: "block mb-2 text-sm font-medium text-gray-700", children: "Upload Files" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    multiple: true,
                    accept: "image/*,.pdf",
                    onChange: handleFileUpload,
                    required: true,
                    className: "block w-full text-sm text-gray-700 border border-gray-300 rounded-lg bg-gray-50 cursor-pointer focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200 p-3"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  disabled: uploading,
                  className: `w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-200 
            ${uploading ? "bg-gray-400 cursor-not-allowed text-gray-200" : "border border-black bg-white text-black hover:bg-black hover:text-white transition"}`,
                  children: uploading ? /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "animate-spin h-5 w-5",
                        xmlns: "http://www.w3.org/2000/svg",
                        fill: "none",
                        viewBox: "0 0 24 24",
                        children: [
                          /* @__PURE__ */ jsx(
                            "circle",
                            {
                              className: "opacity-25",
                              cx: "12",
                              cy: "12",
                              r: "10",
                              stroke: "currentColor",
                              strokeWidth: "4"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "path",
                            {
                              className: "opacity-75",
                              fill: "currentColor",
                              d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: "Uploading..." })
                  ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        className: "h-5 w-5",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg",
                        children: /* @__PURE__ */ jsx(
                          "path",
                          {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "2",
                            d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { children: "Upload" })
                  ] })
                }
              )
            ]
          }
        )
      ]
    }
  ) });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$5,
  default: StudyMaterial,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
async function loader$2({ params }) {
  const client = await pool.connect();
  const result = await client.query("SELECT * FROM files WHERE id = $1", [
    params.fileid
  ]);
  console.log(result.rows[0].title);
  const result1 = await client.query("SELECT * FROM users WHERE id = $1", [
    result.rows[0].uploader_id
  ]);
  const fileDetails = {
    name: result.rows[0].title,
    description: result.rows[0].description,
    uploadedBy: result1.rows[0].name,
    uploadDate: result.rows[0].upload_date,
    downloadUrl: result.rows[0].file_url,
    tags: []
  };
  const result2 = await client.query(
    "SELECT ratings.rater_id, ratings.rating, ratings.comment, ratings.created_at, users.name as rater_name FROM ratings JOIN users ON ratings.rater_id = users.id WHERE ratings.file_id = $1",
    [params.fileid]
  );
  const comments = result2.rows.map((row) => ({
    id: row.rater_id,
    user: row.rater_name,
    comment: row.comment,
    rating: row.rating
  }));
  const result3 = await client.query(
    "SELECT file_tags.name, file_tag_assignments.relevance_score FROM file_tag_assignments JOIN file_tags ON file_tag_assignments.tag_id = file_tags.id WHERE file_tag_assignments.file_id = $1",
    [params.fileid]
  );
  fileDetails.tags = result3.rows.map((row) => ({
    name: row.name,
    relevanceScore: row.relevance_score
  }));
  const genAI = new GoogleGenerativeAI(
    "AIzaSyAkBta4Gql98eHyenjI92zd4I-a_va11Fg"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const ratings = comments.map((comment) => comment.rating);
  const comments_text = comments.map((comment) => comment.comment);
  console.log(ratings);
  console.log(comments_text);
  const prompt = `
You are an AI model that analyzes user feedback. Below are the ratings and comments provided by users for a specific file with name ${fileDetails.name} and desciption ${fileDetails.description}. Please analyze the feedback and provide a summary indicating whether the overall sentiment towards the file is positive, negative, or neutral. Additionally, highlight any common themes or issues mentioned by the users.

Ratings:
${ratings.join(", ")}

Comments:
${comments_text.join("\n")}

Based on the above ratings and comments, what is the overall sentiment towards the file? Is the file generally considered good or bad by the users? Please provide a detailed analysis in 50 words.
`;
  let summary;
  try {
    const ratings_summary = await model.generateContent(prompt);
    summary = ratings_summary.response.text();
  } catch (error) {
    console.error("Error connecting to NLP Sentiment Analysis Server:", error);
    summary = "Error connecting to NLP Sentiment Analysis Server Error";
  }
  return json({ fileDetails, comments, summary });
}
async function action$4({ request, params }) {
  const formData = await request.formData();
  const { id: userId } = await authenticator.isAuthenticated(request);
  console.log(formData.get("comment"));
  console.log(formData.get("rating"));
  console.log(userId);
  const client = await pool.connect();
  await client.query(
    "INSERT INTO ratings (rater_id, file_id, rating, comment) VALUES ($1, $2, $3, $4)",
    [userId, params.fileid, formData.get("rating"), formData.get("comment")]
  );
  const result = await client.query(
    "SELECT AVG(rating) as average_rating FROM ratings WHERE file_id = $1",
    [params.fileid]
  );
  console.log(result.rows[0].average_rating);
  await client.query("UPDATE files SET average_rating = $1 WHERE id = $2", [
    result.rows[0].average_rating,
    params.fileid
  ]);
  const tagRatings = formData.getAll("tagRating").map((rating) => JSON.parse(rating));
  for (const { tagName, rating } of tagRatings) {
    const tagResult = await client.query(
      `
      SELECT file_tags.id, file_tag_assignments.relevance_score 
      FROM file_tags
      JOIN file_tag_assignments ON file_tags.id = file_tag_assignments.tag_id
      WHERE file_tags.name = $1;
      `,
      [tagName]
    );
    const tagId = tagResult.rows[0].id;
    const currentRelevanceScore = tagResult.rows[0].relevance_score;
    const newRelevanceScore = (currentRelevanceScore + rating) / 2;
    await client.query(
      "UPDATE file_tag_assignments SET relevance_score = $1 WHERE file_id = $2 AND tag_id = $3",
      [newRelevanceScore, params.fileid, tagId]
    );
  }
  return json({ success: true });
}
function Dashboard$1() {
  const { fileDetails, comments, summary } = useLoaderData();
  const [rating, setRating] = useState(0);
  const [tagRatings, setTagRatings] = useState({});
  const handleTagRatingChange = (tagName, rating2) => {
    setTagRatings((prevRatings) => ({
      ...prevRatings,
      [tagName]: rating2
    }));
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold mb-6", children: "File Details" }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow mb-6", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-3xl mb-2", children: /* @__PURE__ */ jsx("b", { children: fileDetails.name }) }),
      /* @__PURE__ */ jsx("p", { className: "mb-2", children: fileDetails.description }),
      /* @__PURE__ */ jsxs("p", { className: "mb-1", children: [
        /* @__PURE__ */ jsx("b", { children: "Uploaded by:" }),
        " ",
        fileDetails.uploadedBy
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mb-1", children: [
        /* @__PURE__ */ jsx("b", { children: "Date:" }),
        " ",
        fileDetails.uploadDate
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mb-1", children: [
        /* @__PURE__ */ jsx("b", { children: "Tags:" }),
        fileDetails.tags.map((tag) => /* @__PURE__ */ jsxs(
          "span",
          {
            className: "bg-gray-200 m-1 text-gray-700 px-3 py-1 rounded-full",
            children: [
              tag.name,
              " (",
              tag.relevanceScore,
              " ★)"
            ]
          },
          tag.name
        ))
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mb-1", children: [
        /* @__PURE__ */ jsx("b", { children: "AI File Sentiment Analysis:" }),
        /* @__PURE__ */ jsx("br", {}),
        summary
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-5 mb-2", children: /* @__PURE__ */ jsx(
        "a",
        {
          href: fileDetails.downloadUrl,
          className: "border border-black bg-white text-black px-4 py-2 rounded-3xl hover:bg-black hover:text-white transition mr-1.5 w-full mt-2",
          download: true,
          children: "Download File"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-lg shadow", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl mb-4", children: "Previous Comments" }),
      comments.map((comment) => /* @__PURE__ */ jsxs("div", { className: "border-b py-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("strong", { children: comment.user }),
          /* @__PURE__ */ jsxs("span", { className: "text-black-400", children: [
            "★".repeat(comment.rating),
            " (",
            comment.rating,
            "/5)"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2", children: comment.comment })
      ] }, comment.id))
    ] }),
    /* @__PURE__ */ jsxs(Form, { method: "post", className: "bg-white p-4 rounded-lg shadow mt-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("label", { className: "block mb-2", children: "Rating:" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setRating(star),
            className: `text-2xl ${rating >= star ? "text-black-400" : "text-gray-300"}`,
            children: "★"
          },
          star
        )) })
      ] }),
      /* @__PURE__ */ jsx("hr", {}),
      /* @__PURE__ */ jsx("br", {}),
      fileDetails.tags.map((tag) => /* @__PURE__ */ jsxs("div", { className: "mb-2 flex items-center", children: [
        /* @__PURE__ */ jsxs("span", { className: "bg-gray-200 mb-1 text-gray-700 px-3 py-1 rounded-full", children: [
          tag.name,
          " (",
          tag.relevanceScore,
          " ★)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2 ml-2 mt-1", children: [0, 0.25, 0.5, 0.75, 1].map((score) => /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => handleTagRatingChange(tag.name, score),
            className: `text-xl ${tagRatings[tag.name] >= score ? "text-black-400" : "text-gray-300"}`,
            children: "★"
          },
          score
        )) })
      ] }, tag.name)),
      /* @__PURE__ */ jsx("input", { type: "hidden", name: "rating", value: rating }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          name: "comment",
          className: "w-full border p-2 rounded",
          placeholder: "Write your comment...",
          rows: 3
        }
      ),
      fileDetails.tags.map((tag) => /* @__PURE__ */ jsx(
        "input",
        {
          type: "hidden",
          name: "tagRating",
          value: JSON.stringify({
            tagName: tag.name,
            rating: tagRatings[tag.name] || 0
          })
        },
        tag.name
      )),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "border border-black bg-white text-black px-4 py-2 rounded-3xl hover:bg-black hover:text-white transition mr-1.5 mt-2",
          children: "Submit Review"
        }
      )
    ] })
  ] });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$4,
  default: Dashboard$1,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
const action$3 = async ({ request }) => {
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
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen backdrop-blur-3xl", children: /* @__PURE__ */ jsx("div", { className: "flex bg-gray-100 bg-opacity-80 rounded-3xl shadow-lg p-8 max-w-xl w-full", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center p-10", children: /* @__PURE__ */ jsxs(
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
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$3,
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
const action$2 = async ({ request }) => {
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
    if (result.rows.length > 0) {
      return redirect("/sign-in", {
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return redirect("/404");
  } catch (error) {
    if (error.code === "23505" && error.detail.includes("Key (email)")) {
      return json({ error: "Email already exists" }, { status: 400 });
    }
    return json(
      { error: "There was an issue creating your account" },
      { status: 500 }
    );
  }
};
function SignUpForm() {
  var _a;
  const loaderData = useLoaderData();
  const actionData = useActionData();
  return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center min-h-screen backdrop-blur-3xl", children: /* @__PURE__ */ jsx("div", { className: "flex bg-gray-100 bg-opacity-80 rounded-3xl shadow-lg p-8 max-w-xl w-full", children: /* @__PURE__ */ jsx("div", { className: "flex justify-center p-10", children: /* @__PURE__ */ jsxs(Form, { method: "post", className: "w-full max-w-lg font-sans", children: [
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
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2,
  default: SignUpForm,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
function Sidebar() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  return /* @__PURE__ */ jsx("div", { className: "w-64 bg-[#fafafa] text-[#333333] flex flex-col", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-col p-4", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: toggleDropdown,
        className: "flex items-center justify-between mt-2 mb-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",
        children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Study Material" }),
          /* @__PURE__ */ jsx(
            "svg",
            {
              className: `w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`,
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M19 9l-7 7-7-7"
                }
              )
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "pl-4 mt-2 space-y-2", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `/dash/${id}/community-operated`,
          className: "block text-gray-700 hover:text-gray-500 px-4 py-2 rounded-lg",
          children: "Community operated"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/404",
          className: "block text-gray-700 hover:text-gray-500 px-4 py-2 rounded-lg",
          children: "College operated"
        }
      )
    ] }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => window.location.href = "/404",
        className: "flex items-center justify-between mt-2 mb-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",
        children: /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Mentorship Program" })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => window.location.href = "/404",
        className: "flex items-center justify-between mt-2 mb-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",
        children: /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Car Pooling" })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => window.location.href = "/404",
        className: "flex items-center justify-between mt-2 mb-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",
        children: /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Accommodation" })
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => window.location.href = "/404",
        className: "flex items-center justify-between mt-2 mb-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors",
        children: /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Campus Dating" })
      }
    )
  ] }) });
}
function Navbar() {
  const navigate = useNavigate$1();
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between bg-[#fafafa]/80 backdrop-blur-3xl text-[#333333] p-4 h-[50px]", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4 text-lg font-bold", children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/logo_UniNet_text.png",
        alt: "Uninet Logo",
        className: "h-6 w-auto",
        onClick: () => navigate("/dash/id")
      }
    ) }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center space-x-4", children: /* @__PURE__ */ jsx(Form, { method: "post", action: "/log-out", children: /* @__PURE__ */ jsx(
      "button",
      {
        type: "submit",
        className: "inline-flex h-full w-full items-center justify-center rounded-full bg-neutral-950 px-3 py-1 text-xs font-medium text-gray-50 backdrop-blur-3xl",
        children: "Logout"
      }
    ) }) })
  ] });
}
function PopoverExample() {
  return /* @__PURE__ */ jsxs(HoverCard.Root, { openDelay: 200, closeDelay: 300, children: [
    /* @__PURE__ */ jsx(HoverCard.Trigger, { asChild: true, children: /* @__PURE__ */ jsx(
      "a",
      {
        className: "rounded-full inline-block",
        href: "https://github.com/shashantbhat",
        target: "_blank",
        rel: "noreferrer noopener",
        children: /* @__PURE__ */ jsx(
          "img",
          {
            className: "rounded-full",
            src: "https://avatars.githubusercontent.com/u/120403073?s=400&u=91f83f229e8ec573ca1391b66e45082cca5b4b81&v=4",
            alt: "Shashant's image",
            width: 45,
            height: 45
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsx(HoverCard.Portal, { children: /* @__PURE__ */ jsxs(
      HoverCard.Content,
      {
        className: "bg-white rounded-lg shadow-lg p-4 w-64",
        sideOffset: 5,
        children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 10 },
              transition: { duration: 0.2 },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      className: "rounded-full",
                      src: "https://avatars.githubusercontent.com/u/120403073?s=400&u=91f83f229e8ec573ca1391b66e45082cca5b4b81&v=4",
                      alt: "Shashant's image",
                      width: 45,
                      height: 45
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-medium", children: "Shashant Bhat" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "@shashantbhat" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Student at JIIT" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(HoverCard.Arrow, { className: "fill-white" })
        ]
      }
    ) }) })
  ] });
}
function PopoverExample1() {
  return /* @__PURE__ */ jsxs(HoverCard.Root, { openDelay: 200, closeDelay: 300, children: [
    /* @__PURE__ */ jsx(HoverCard.Trigger, { asChild: true, children: /* @__PURE__ */ jsx(
      "a",
      {
        className: "rounded-full inline-block",
        href: "https://github.com/yash-dhingra",
        target: "_blank",
        rel: "noreferrer noopener",
        children: /* @__PURE__ */ jsx(
          "img",
          {
            className: "rounded-full",
            src: "https://avatars.githubusercontent.com/u/77784099?v=4",
            alt: "Yash's image",
            width: 45,
            height: 45
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsx(HoverCard.Portal, { children: /* @__PURE__ */ jsxs(
      HoverCard.Content,
      {
        className: "bg-white rounded-lg shadow-lg p-4 w-64",
        sideOffset: 5,
        children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 10 },
              transition: { duration: 0.2 },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      className: "rounded-full",
                      src: "https://avatars.githubusercontent.com/u/77784099?v=4",
                      alt: "Yash's image",
                      width: 45,
                      height: 45
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-medium", children: "Yash Dhingra" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "@yash-dhingra" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Student at JIIT" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(HoverCard.Arrow, { className: "fill-white" })
        ]
      }
    ) }) })
  ] });
}
function PopoverExample2() {
  return /* @__PURE__ */ jsxs(HoverCard.Root, { openDelay: 200, closeDelay: 300, children: [
    /* @__PURE__ */ jsx(HoverCard.Trigger, { asChild: true, children: /* @__PURE__ */ jsx(
      "a",
      {
        className: "rounded-full inline-block",
        href: "https://github.com/Shivankbutani",
        target: "_blank",
        rel: "noreferrer noopener",
        children: /* @__PURE__ */ jsx(
          "img",
          {
            className: "rounded-full",
            src: "https://avatars.githubusercontent.com/u/188903980?v=4",
            alt: "Shivanks's image",
            width: 45,
            height: 45
          }
        )
      }
    ) }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsx(HoverCard.Portal, { children: /* @__PURE__ */ jsxs(
      HoverCard.Content,
      {
        className: "bg-white rounded-lg shadow-lg p-4 w-64",
        sideOffset: 5,
        children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              exit: { opacity: 0, y: 10 },
              transition: { duration: 0.2 },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      className: "rounded-full",
                      src: "https://avatars.githubusercontent.com/u/188903980?v=4",
                      alt: "Shivanks's image",
                      width: 45,
                      height: 45
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-medium", children: "Shivank Butani" }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "@Shivankbutani" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Student at JIIT" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(HoverCard.Arrow, { className: "fill-white" })
        ]
      }
    ) }) })
  ] });
}
function TextGlitch() {
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden font-medium group", children: [
    /* @__PURE__ */ jsx("span", { className: "invisible", children: "Meet the Developers" }),
    /* @__PURE__ */ jsx("span", { className: "text-neutral-400 absolute top-0 left-0 group-hover:-translate-y-full transition-transform ease-in-out duration-500 hover:duration-300", children: "Meet the Developers" }),
    /* @__PURE__ */ jsx("span", { className: "text-neutral-400 absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform ease-in-out duration-500 hover:duration-300", children: "Meet the Developers" })
  ] });
}
function cn$1(...classes) {
  return classes.filter(Boolean).join(" ");
}
function TextGenerateEffectExample() {
  const text = `Welcome to UniNet`;
  return /* @__PURE__ */ jsx(TextGenerateEffect, { text, duration: 0.5 });
}
function TextGenerateEffect({
  text,
  duration = 0.5,
  className
}) {
  return /* @__PURE__ */ jsx(motion.div, { className: "inline-block whitespace-pre", children: text.split("").map((char, index) => /* @__PURE__ */ jsx(
    motion.span,
    {
      className: cn$1(
        "inline-block whitespace-pre text-black",
        className
      ),
      initial: { opacity: 0, filter: "blur(4px)", rotateX: 90, y: 5 },
      whileInView: {
        opacity: 1,
        filter: "blur(0px)",
        rotateX: 0,
        y: 0
      },
      transition: {
        ease: "easeOut",
        duration,
        delay: index * 0.015
      },
      viewport: { once: true },
      children: char
    },
    `${char}-${index}`
  )) });
}
function CardRevealedPointer() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const background = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(38, 38, 38, 0.4), transparent 80%)`;
  return /* @__PURE__ */ jsx(
    "div",
    {
      onMouseMove: (e) => {
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - left);
        mouseY.set(e.clientY - top);
      },
      className: "group relative w-full max-w-[350px] overflow-hidden rounded-xl bg-neutral-950",
      children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: "https://github.com/shashantbhat/UniNet-Remix",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "group relative block w-full rounded-xl hover:no-underline transition-all duration-300 hover:scale-105",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-white/30 via-10% to-transparent" }),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                className: "pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100",
                style: {
                  background
                }
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "relative flex flex-col gap-3 rounded-xl border border-white/10 px-4 py-5", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-neutral-200", children: "From The Developers🚀" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm leading-[1.5] text-neutral-400", children: "UniNet is still is in development. We are working hard to make it, we appreciate your feedback and contributions. Use it, test it throughly, if possible you can contribute to the project. open up new issue make your PR, we will review it. you can check the Github repository just by a click." })
            ] }) })
          ]
        }
      )
    }
  );
}
function CardBackgroundShine() {
  return /* @__PURE__ */ jsx("div", { className: "inline-flex w-full max-w-[350px] animate-shine items-center justify-center rounded-xl border border-white/10 bg-[linear-gradient(110deg,#000103,45%,#303030,55%,#000103)] bg-[length:400%_100%] px-4 py-5 text-sm transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold text-neutral-200", children: "Hey Mates👋🏻" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm leading-[1.5] text-neutral-400", children: "Lets build the community strongs💪🌐. As per now the Community operated section is functional. Try that out, help the other users, share your knowledge. Don't forget to give your feedback on the files. Helps you to get the best out of UniNet. And for us to optimize our cloud storage☺️." })
  ] }) });
}
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
function InfiniteSliderExample() {
  return /* @__PURE__ */ jsxs(InfiniteSlider, { pauseOnHover: true, children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/mentor.png",
        className: "aspect-square w-[150px] h-[80px] rounded-[4px]",
        alt: "mentor"
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/pg mates.png",
        className: "aspect-square w-[130px] h-[80px] rounded-[4px]",
        alt: "pg mates"
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/dating.png",
        className: "aspect-square w-[130px] h-[80px] rounded-[4px]",
        alt: "dating"
      }
    ),
    /* @__PURE__ */ jsx(
      "img",
      {
        src: "/carpool.png",
        className: "aspect-square w-[150px] h-[80px] rounded-[4px]",
        alt: "carpool"
      }
    )
  ] });
}
function InfiniteSlider({
  children,
  className,
  pauseOnHover
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      "data-id": "slider",
      className: cn("group relative flex gap-10 overflow-hidden", className),
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute left-0 w-1/12 h-full bg-gradient-to-r from-background to-transparent z-10" }),
        Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: cn(
              "flex shrink-0 animate-infinite-slider justify-around gap-10 [--gap:1rem]",
              pauseOnHover && "group-hover:[animation-play-state:paused]"
            ),
            "data-id": `slider-child-${i + 1}`,
            children
          },
          i
        )),
        /* @__PURE__ */ jsx("div", { className: "absolute right-0 w-1/12 h-full bg-gradient-to-l from-background to-transparent z-10" })
      ]
    }
  );
}
function DashboardLayout() {
  const location = useLocation();
  const shouldHideContent = location.pathname.includes("/community-operated") || location.pathname.includes("/files/") || location.pathname.includes("/upload-material");
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-screen", children: [
    /* @__PURE__ */ jsx("div", { className: "fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm", children: /* @__PURE__ */ jsx(Navbar, {}) }),
    /* @__PURE__ */ jsx("div", { className: "fixed bg-[#fafafa] top-[50px] left-0 h-full z-40", children: /* @__PURE__ */ jsx(Sidebar, {}) }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-grow mt-[50px] ml-[240px]", children: /* @__PURE__ */ jsxs("main", { className: "flex-grow p-4 bg-[#fafafa]", children: [
      !shouldHideContent && /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center pt-8", children: /* @__PURE__ */ jsx("div", { className: "text-4xl font-bold", children: /* @__PURE__ */ jsx(TextGenerateEffectExample, {}) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-center pt-12 space-x-8", children: [
          /* @__PURE__ */ jsx(TextGlitch, {}),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(PopoverExample, {}) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(PopoverExample1, {}) }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(PopoverExample2, {}) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-center text-gray-700 max-w-2xl mx-auto my-6 leading-relaxed", children: "UniNet was created to simplify university life by addressing key challenges like data management, study material access, and connectivity. Designed with students, admins, and developers in mind, it provides tailored dashboards, seamless file management, and a reliable platform to empower academic communities." }),
        /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-center items-center gap-8 p-8 max-w-6xl mx-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2 max-w-xl hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(CardRevealedPointer, {}) }),
          /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2 max-w-xl hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(CardBackgroundShine, {}) })
        ] }) }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(InfiniteSliderExample, {}) })
      ] }),
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("footer", { className: "border-t border-gray-700/30 mt-12 bg-transparent", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-4 py-4", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-gray-800 font-semibold", children: "UniNet" }),
          /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "|" }),
          /* @__PURE__ */ jsx("a", { href: "/dash/id", className: "text-gray-600 hover:text-blue-600", children: "Dashboard" }),
          /* @__PURE__ */ jsx("a", { href: "https://github.com/shashantbhat/UniNet-Remix", className: "text-gray-600 hover:text-blue-600", children: /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "22", height: "22", fill: "#000000", viewBox: "0 0 256 256", children: /* @__PURE__ */ jsx("path", { d: "M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z" }) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "mailto:ask.uninet@gmail.com",
              className: "text-gray-600 hover:text-blue-600 transition-colors duration-200",
              children: "ask.uninet@gmail.com"
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "text-gray-600", children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            " UniNet"
          ] })
        ] })
      ] }) }) }) })
    ] }) })
  ] });
}
function Dashboard() {
  return /* @__PURE__ */ jsx(DashboardLayout, {});
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Dashboard
}, Symbol.toStringTag, { value: "Module" }));
const action$1 = async ({ request, context }) => {
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
              src: "/logo_UniNet_globe.png",
              alt: "Uni-Net Logo",
              className: "mb-6 max-w-sm mx-auto"
            }
          ),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/logo_UniNet_text.png",
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
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1,
  default: LoginPage,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const action = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/sign-in", {
    headers: {
      "Set-Cookie": await destroySession(session)
    }
  });
};
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
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
          duration: 0.3,
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
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: NotFound
}, Symbol.toStringTag, { value: "Module" }));
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
    timeline.to(helloElement, { opacity: 0, duration: 1, delay: 1 }).to(helloElement, { display: "none" }).set(welcomeElement, { display: "flex" }).to(welcomeElement, { opacity: 1, duration: 1, delay: 0.5 }).to(welcomeElement, { opacity: 0, duration: 1, delay: 0.5, onComplete: () => {
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
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CatchBoundary,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-hwoGmBrw.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/components-D27kuvza.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-Bb1iW255.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/components-D27kuvza.js"], "css": ["/assets/root-Bsx6Kq07.css"] }, "routes/dash._student.$id.community-operated": { "id": "routes/dash._student.$id.community-operated", "parentId": "routes/dash._student.$id", "path": "community-operated", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dash._student._id.community-operated-DltJfZAz.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/components-D27kuvza.js"], "css": ["/assets/dash._student._id-BkwXyobe.css"] }, "routes/dash._student.$id.upload-material": { "id": "routes/dash._student.$id.upload-material", "parentId": "routes/dash._student.$id", "path": "upload-material", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dash._student._id.upload-material-ClN2wPpI.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/components-D27kuvza.js"], "css": [] }, "routes/dash._student.$id.files.$fileid": { "id": "routes/dash._student.$id.files.$fileid", "parentId": "routes/dash._student.$id", "path": "files/:fileid", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dash._student._id.files._fileid-DdHgpx8C.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/components-D27kuvza.js"], "css": [] }, "routes/_auth.sign-up-college": { "id": "routes/_auth.sign-up-college", "parentId": "root", "path": "sign-up-college", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-up-college-CutOkbAd.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/components-D27kuvza.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/_auth.sign-up-student": { "id": "routes/_auth.sign-up-student", "parentId": "root", "path": "sign-up-student", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-up-student-CSk8G60Z.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/components-D27kuvza.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/dash._student.$id": { "id": "routes/dash._student.$id", "parentId": "root", "path": "dash/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/dash._student._id-DOm7tw4t.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/components-D27kuvza.js"], "css": [] }, "routes/_auth.sign-in": { "id": "routes/_auth.sign-in", "parentId": "root", "path": "sign-in", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_auth.sign-in-CJ3tHT15.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/components-D27kuvza.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/log-out": { "id": "routes/log-out", "parentId": "root", "path": "log-out", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/log-out-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BseHtYz0.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/index-DjKJqAo0.js"], "css": ["/assets/grad_bg-DXCTpALp.css"] }, "routes/404": { "id": "routes/404", "parentId": "root", "path": "404", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/404-ESjHsLO1.js", "imports": ["/assets/index-TckX4F0b.js", "/assets/index-DjKJqAo0.js", "/assets/components-D27kuvza.js"], "css": [] } }, "url": "/assets/manifest-ad86a76c.js", "version": "ad86a76c" };
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
  "routes/dash._student.$id.files.$fileid": {
    id: "routes/dash._student.$id.files.$fileid",
    parentId: "routes/dash._student.$id",
    path: "files/:fileid",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/_auth.sign-up-college": {
    id: "routes/_auth.sign-up-college",
    parentId: "root",
    path: "sign-up-college",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_auth.sign-up-student": {
    id: "routes/_auth.sign-up-student",
    parentId: "root",
    path: "sign-up-student",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/dash._student.$id": {
    id: "routes/dash._student.$id",
    parentId: "root",
    path: "dash/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/_auth.sign-in": {
    id: "routes/_auth.sign-in",
    parentId: "root",
    path: "sign-in",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/log-out": {
    id: "routes/log-out",
    parentId: "root",
    path: "log-out",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route9
  },
  "routes/404": {
    id: "routes/404",
    parentId: "root",
    path: "404",
    index: void 0,
    caseSensitive: void 0,
    module: route10
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
