import ConvertApi from "convertapi-js";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

function StepOne({
  currentStep,
  handleStepCounter,
  srcFile,
  setSrcFile,
  handleDataChange,
}) {
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(false);
  const [checkPhoneNo, setCheckPhoneNo] = useState(false);
  const [checkFile, setCheckFile] = useState(false);
  const pattern = new RegExp(
    "(?:(?:\\+|0{0,2})91(\\s*[\\- ]\\s*)?|[0 ]?)?[789]\\d{9}|(\\d[ -]?){10}\\d",
    "g"
  );
  const handleFileChange = async (e) => {
    setLoading(true);
    setCheckFile(true);
    setSrcFile({
      ...srcFile,
      loading: true,
    });
    let src = URL.createObjectURL(e.target.files[0]);
    let ext = e.target.files[0].name.split(".").pop();

    handleDataChange("file", e.target.files[0]);

    if (ext === "doc" || ext === "docx") {
      let convertApi = ConvertApi.auth("qNB6RrPfr7AVwiNj");
      let params = convertApi.createParams();
      params.add("File", e.target.files[0]);
      let result = await convertApi.convert(ext, "png", params);
      src = result.files[0].Url;
      ext = "png";
    }

    setSrcFile({
      src: src,
      file: e.target.files[0],
      ext: ext,
      loading: false,
    });
    setLoading(false);
  };

  const handlePhoneNoValidation = (e) => {
    if (!pattern.test(e.target.value)) {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 500);
    } else {
      handleDataChange("phone", e.target.value);
      setIsError(false);
    }
    setCheckPhoneNo(true);
  };

  const handleNextButton = () => {
    if (checkPhoneNo && checkFile) {
      handleStepCounter(1);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };

  return (
    <>
      {error ? (
        <div
          className="alert alert-danger fixed z-10 top-0 w-full font-semibold text-sm md:text-md"
          role="alert"
        >
          !! Phone number or file is missing !!
        </div>
      ) : null}
      <div
        className={`bg-white h-fit border-2 py-5 px-10 mt-5 step-one ${
          currentStep !== 1 ? "hide" : ""
        }`}
      >
        <h1 className="text-4xl mb-2">RTP</h1>
        <div className="input-field flex flex-col">
          <input
            type="text"
            placeholder="Enter phone number"
            name="phone"
            id="phone"
            maxLength={10}
            className="pl-2 form-control"
            onChange={handlePhoneNoValidation}
          />

          {isError ? (
            <p className="text-red-600 text-start inline-block text-sm">
              Invalid Phone number
            </p>
          ) : (
            ""
          )}
        </div>

        <div className="input-field">
          <div className="col-span-full">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <PhotoIcon
                  className="mx-auto h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  Pdf, doc or docx
                </p>
              </div>
            </div>
          </div>
          <div className="text-sm mt-1">
            {loading ? (
              <>
                <div className="spinner-border w-5 h-5 mt-1" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </>
            ) : (
              <p className="text-start">{srcFile.file.name}</p>
            )}
          </div>
        </div>

        <button onClick={handleNextButton}>Next</button>
      </div>
    </>
  );
}

export default StepOne;
