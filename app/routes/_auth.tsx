import {Outlet} from "@remix-run/react"

export default function auth() {
    return (
        <div>
            <header className="sticky top-0 backdrop-blur text-gray-600 body-font">
                <div className="container mx-auto flex flex-nowrap p-5 flex-col md:flex-row items-center backdrop-blur">
                    <img className={"flex h-20"} src={"uninet-logo.png"} alt={"uninet logo"}/>

                    {/* Centered navigation links */}
                    <nav className="flex basis-3/4 ml-[165px] items-center justify-center">
                        {/* href to be added */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                             viewBox="0 0 256 256">
                            <path
                                d="M226.53,56.41l-96-32a8,8,0,0,0-5.06,0l-96,32A8,8,0,0,0,24,64v80a8,8,0,0,0,16,0V75.1L73.59,86.29a64,64,0,0,0,20.65,88.05c-18,7.06-33.56,19.83-44.94,37.29a8,8,0,1,0,13.4,8.74C77.77,197.25,101.57,184,128,184s50.23,13.25,65.3,36.37a8,8,0,0,0,13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64,64,0,0,0,20.65-88l44.12-14.7a8,8,0,0,0,0-15.18ZM176,120A48,48,0,1,1,89.35,91.55l36.12,12a8,8,0,0,0,5.06,0l36.12-12A47.89,47.89,0,0,1,176,120ZM128,87.57,57.3,64,128,40.43,198.7,64Z"></path>
                        </svg>
                        <a className="hover:text-gray-900 mr-10">Student</a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000"
                             viewBox="0 0 256 256">
                            <path
                                d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z"></path>
                        </svg>
                        <a className="hover:text-gray-900">Educational Institute</a>
                    </nav>

                    {/* Right-side sign-in section */}
                    <div className="flex basis-1/4 items-center justify-end flex-1 space-x-2">
                        <span>Already have an account?</span>
                        <button
                            className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base">
                            Sign in
                        </button>
                    </div>
                </div>
            </header>
            <Outlet/>
        </div>
    );
}

