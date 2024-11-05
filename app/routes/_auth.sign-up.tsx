import React, { useState } from "react";
import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, json, redirect } from "@remix-run/node";
import bcrypt from "bcrypt";
import pool from "~/utils/db.server"; // Importing the database connection
import "~/grad_bg.css";

type ActionData = {
    error?: string;
    success?: string;
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const collegeName = formData.get("collegeName") as string;
    const universityName = formData.get("universityName") as string;
    const universityEmail = formData.get("universityEmail") as string;
    const enrollmentId = formData.get("enrollmentId") as string;
    const collegeId = formData.get("collegeId") as File | Blob;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const password = formData.get("password") as string;

    // Hash the password before storing it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Convert the collegeId Blob to binary data (Buffer)
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
        return json<ActionData>({ error: "There was an issue creating your account." });
    }
};

// Remix Form component
export default function SignUpForm() {
    const actionData = useActionData();
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveFile = () => {
        setPreview(null);
    };

    return (
        <div className="flex items-center justify-center min-h-screen backdrop-blur-3xl bg-gradient-animation">
            {/* Centered Container with White Background  style={{backgroundColor:"#F1F1F1"}} */}
            <div className="flex bg-gray-100 bg-opacity-80 rounded-3xl shadow-lg p-8 max-w-xl w-full">
                <div className="flex justify-center p-10">
                    <Form encType="multipart/form-data" method="post" className="w-full max-w-lg font-sans">
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="firstName">
                                    First Name
                                </label>
                                <input
                                    className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                                    name="firstName"
                                    id="first-name"
                                    type="text"
                                    placeholder="First Name"
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="lastName">
                                    Last Name
                                </label>
                                <input
                                    className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                                    name="lastName"
                                    id="last-name"
                                    type="text"
                                    placeholder="Last Name"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="instituteDetails">
                                    Institute Details
                                </label>

                                <input
                                    className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                                    name="collegeName"
                                    id="college-name"
                                    type="text"
                                    placeholder="Enter College Name"
                                />

                                <input
                                    className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                                    name="universityName"
                                    id="university-name"
                                    type="text"
                                    placeholder="Enter University Name"
                                />

                                <input
                                    className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                                    name="universityEmail"
                                    id="university-email"
                                    type="text"
                                    placeholder="Enter University Email ID"
                                />


                                <input
                                    className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                                    name="enrollmentId"
                                    id="enrollment-id"
                                    type="text"
                                    placeholder="Enter Enrollement ID"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="collegeId">
                                College ID
                            </label>
                            <div className="flex flex-col items-center justify-center w-full">
                                <label
                                    htmlFor="dropzone-file"
                                    className="h-28 flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  hover:bg-gray-100"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <svg
                                            className="w-8 h-8 mb-4 text-gray-500"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 20 16"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                            />
                                        </svg>
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span> or drag and
                                            drop
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                                        </p>
                                    </div>
                                    <input
                                        id="dropzone-file"
                                        name="collegeId"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />

                                </label>
                            </div>


                            {/*<div className="flex justify-center">*/}
                            {/*    <button type="submit"*/}
                            {/*            className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition my-3">*/}
                            {/*        Upload*/}
                            {/*    </button>*/}
                            {/*</div>*/}

                            <div className="flex justify-center">
                                {/* Display the uploaded image preview */}
                                {preview && (
                                    <div className="mt-4">
                                        <div className="flex justify-center">
                                            <img
                                                src={preview}
                                                alt="Uploaded Preview"
                                                className="h-32 w-auto object-contain rounded-md border"
                                            />
                                        </div>
                                        <div className="flex justify-center">
                                            <button
                                                type="button"
                                                className="mt-2 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 my-3"
                                                onClick={handleRemoveFile}
                                            >
                                                Remove File
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap -mx-3 mb-2">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="city">
                                    City
                                </label>
                                <input
                                    className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-11 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                                    name="city"
                                    id="city"
                                    type="text"
                                    placeholder="Your City"
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="state">
                                    State
                                </label>

                                <div className="relative">
                                    <select

                                        className="text-sm block appearance-none w-full bg-gray-50 border-gray-200 border py-3 px-4 h-11 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                                        name="state"
                                        id="state"
                                        defaultValue=""
                                    >
                                        <option value="">
                                            Select Your State
                                        </option>
                                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                                        <option value="Assam">Assam</option>
                                        <option value="Bihar">Bihar</option>
                                        <option value="Chhattisgarh">Chhattisgarh</option>
                                        <option value="Goa">Goa</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Haryana">Haryana</option>
                                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                                        <option value="Jharkhand">Jharkhand</option>
                                        <option value="Karnataka">Karnataka</option>
                                        <option value="Kerala">Kerala</option>
                                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="Manipur">Manipur</option>
                                        <option value="Meghalaya">Meghalaya</option>
                                        <option value="Mizoram">Mizoram</option>
                                        <option value="Nagaland">Nagaland</option>
                                        <option value="Odisha">Odisha</option>
                                        <option value="Punjab">Punjab</option>
                                        <option value="Rajasthan">Rajasthan</option>
                                        <option value="Sikkim">Sikkim</option>
                                        <option value="Tamil Nadu">Tamil Nadu</option>
                                        <option value="Telangana">Telangana</option>
                                        <option value="Tripura">Tripura</option>
                                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                                        <option value="Uttarakhand">Uttarakhand</option>
                                        <option value="West Bengal">West Bengal</option>
                                        <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands
                                        </option>
                                        <option value="Chandigarh">Chandigarh</option>
                                        <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar
                                            Haveli
                                            and
                                            Daman and Diu
                                        </option>
                                        <option value="Lakshadweep">Lakshadweep</option>
                                        <option value="Delhi">Delhi</option>
                                        <option value="Puducherry">Puducherry</option>
                                        <option value="Ladakh">Ladakh</option>
                                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                                    </select>
                                    <div
                                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20">
                                            <path
                                                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="password">
                                    Password
                                </label>
                                <input
                                    className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                                    name="password"
                                    id="password"
                                    type="password"
                                    placeholder="Enter Password"
                                />
                                <p className="text-gray-600 text-xs italic">
                                    Make sure your password is:<br/>
                                    - at least 8 characters long.<br/>
                                    - at least 1 Uppercase letter along with Lowercase.<br/>
                                    - contains a combination of alpha-numeric and special characters.<br/>
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button type="submit"
                                    className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition"
                            >
                                Submit & Sign In
                            </button>
                            {actionData?.error && (
                                <p className="text-red-500 text-sm mt-2">{actionData.error}</p>
                            )}
                            {actionData?.success && (
                                <p className="text-green-500 text-sm mt-2">{actionData.success}</p>
                            )}
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}