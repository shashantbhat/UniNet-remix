import React, {useState} from "react";

const  FormComponent: React.FC = () => {
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
        <div className="flex justify-center min-h-lvh p-10">
            <form className="w-full max-w-lg font-sans">
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="first-name">
                            First Name
                        </label>
                        <input
                            className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                            id="first-name"
                            type="text"
                            placeholder="First Name"
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="last-name">
                            Last Name
                        </label>
                        <input
                            className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                            id="last-name"
                            type="text"
                            placeholder="Last Name"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="password">
                            Institute Details
                        </label>
                        <input
                            className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                            id="college-name"
                            type="text"
                            placeholder="Enter College Name"
                        />

                        <input
                            className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                            id="university-name"
                            type="text"
                            placeholder="Enter University Name"
                        />


                        <input
                            className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                            id="enrollement-id"
                            type="text"
                            placeholder="Enter Enrollement ID"
                        />

                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="password">
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
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                                    </p>
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>

                            {/* Display the uploaded image preview */}
                            {preview && (
                                <div className="mt-4">
                                    <img
                                        src={preview}
                                        alt="Uploaded Preview"
                                        className="h-32 w-auto object-contain rounded-md border"
                                    />
                                    <button
                                        type="button"
                                        className="mt-2 px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                                        onClick={handleRemoveFile}
                                    >
                                        Remove File
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>

                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="city">
                            City
                        </label>
                        <input
                            className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-11 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
                            id="city"
                            type="text"
                            placeholder="Your City"
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="state">
                            State
                        </label>

                        <div className="relative">
                            <select

                                className="text-sm block appearance-none w-full bg-gray-50 border-gray-200 border py-3 px-4 h-11 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
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
                                <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                                <option value="Chandigarh">Chandigarh</option>
                                <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and
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
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                               htmlFor="password">
                            Password
                        </label>
                        <input
                            className="text-sm w-full bg-gray-50 border-gray-200 border py-3 px-4 h-9 rounded-[10px] mb-3 focus:outline-none hover:bg-gray-100"
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
            </form>
        </div>
    )
}
export default FormComponent;