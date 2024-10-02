import React from "react";
import "app/grad_bg.css"; // Import the gradient background animation CSS

const FormComponent: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen backdrop-blur-3xl bg-gradient-animation">
            {/* Centered Container with White Background  style={{backgroundColor:"#F1F1F1"}} */}
            <div  className="flex bg-gray-100 bg-opacity-75 rounded-3xl shadow-lg p-8 max-w-6xl w-full">
                {/* Left Side with Logo */}
                <div className="w-1/2 flex items-center justify-center">
                    <div className="text-center m-10">
                        <img
                            src="public/logo_UniNet_globe.png"
                            alt="Uni-Net Logo"
                            className="mb-6 max-w-sm mx-auto "
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
                        <form>
                            <div className="mb-4">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="userId"
                                >
                                    User ID
                                </label>
                                <input
                                    id="userId"
                                    type="text"
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
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                                />
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <a href="#" className=" hover:underline block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Forgot Password?
                                </a>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition mr-1.5" formAction="sign-up">
                                    Sign Up
                                </button>
                                <button
                                    className="bg-black text-white px-4 py-2 rounded-3xl hover:bg-gray-800 transition ml-1.5" >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormComponent;