import {
  ActionFunction,
  json,
  LoaderFunction,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import authenticator from "~/utils/auth.server";
import { sessionStorage } from "~/utils/session.server";
import React, { useEffect, useState } from "react";
import "app/grad_bg.css";
/**
 * called when the user hits button to login
 *
 * @param param0
 * @returns
 */

export const action: ActionFunction = async ({ request, context }) => {
  // call my authenticator
  const resp = await authenticator.authenticate("form", request, {
    successRedirect: "/dash/id",
    failureRedirect: "/sign-in",
    throwOnError: true,
    context,
  });
  console.log(resp);
  return resp;
};

/**
 * get the cookie and see if there are any errors that were
 * generated when attempting to login
 *
 * @param param0
 * @returns
 */
export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dash/id",
  });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const error = session.get("sessionErrorKey");
  return json<any>({ error });
};

type LoaderData = {
  error?: {
    message: string;
  };
};



/**
 *
 * @returns
 */
export default function LoginPage() {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
      setIsVisible(true); // Trigger the fade-in when component mounts
    }, []);
  // if i got an error it will come back with the loader data
  const loaderData = useLoaderData<LoaderData>();
  return (
    <div className="flex items-center justify-center min-h-screen backdrop-blur-3xl bg-gradient-animation">
      {/* Centered Container with White Background */}
      <div
        className={`flex bg-gray-100 bg-opacity-75 rounded-3xl shadow-lg p-8 max-w-6xl w-full transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Left Side with Logo */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="text-center m-10">
            <img
              src="public/logo_UniNet_globe.png"
              alt="Uni-Net Logo"
              className="mb-6 max-w-sm mx-auto"
            />
            <img
              src="public/logo_UniNet_text.png"
              alt="Company Text"
              className="max-w-sm mx-auto"
            />
          </div>
        </div>

        {/* Right Side with Sign-In Form */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold text-center block tracking-wide text-gray-700 mb-10">
              Sign In to Continue to UniNet
            </h1>
            <form method="post">
              <div className="mb-4">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="userId"
                >
                  User ID
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your user ID"
                  className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                />
              </div>

              <div className="mb-6">
                <label
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                />
              </div>

              <div className="flex items-center justify-between mb-4">
                <a
                  href="#"
                  className=" hover:underline block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                >
                  Forgot Password?
                </a>
              </div>

              <div className="flex justify-center p-1">
                <button className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition mr-1.5 w-full">
                  Sign In
                </button>
              </div>

              <div className="flex justify-center p-1">
                <button
                  className="border border-black bg-white text-black px-4 py-2 rounded-3xl hover:bg-gray-100 transition mr-1.5 w-full "
                  onClick={() => {
                    window.location.href = "/sign-up-student";
                  }}
                >
                  Sign Up as Student
                </button>
              </div>

              <div className="flex justify-center p-1">
                <button
                  className="border border-black bg-white text-black px-4 py-2 rounded-3xl hover:bg-gray-100 transition mr-1.5 w-full"
                  onClick={() => {
                    window.location.href = "/sign-up-college";
                  }}
                >
                  Sign Up as College
                </button>
              </div>
            </form>

            <div>
              {loaderData?.error ? (
                <p>ERROR: {loaderData?.error?.message}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
