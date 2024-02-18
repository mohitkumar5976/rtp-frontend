import React, { useState } from "react";
import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [srcFile, setSrcFile] = useState({
    src: "",
    file: "",
    ext: "",
    loading: true,
  });
  const [data, setData] = useState({
    phone: "",
    file: "",
    noOfPages: 0,
    grayOrColored: "",
    noOfCopies: 0,
    pageSizeFormat: "",
    pageSides: "",
  });

  const handleStepCounter = (direction) => {
    direction = Math.sign(direction);
    setCurrentStep(currentStep + direction);
  };

  const handleDataChange = (type, val) => {
    switch (type) {
      case "phone":
        setData({
          ...data,
          phone: val,
        });
        break;
      case "file":
        setData({
          ...data,
          file: val,
        });
        break;
      case "noOfPages":
        setData({
          ...data,
          noOfPages: val,
        });
        break;
      case "grayOrColored":
        setData({
          ...data,
          grayOrColored: val,
        });
        break;
      case "noOfCopies":
        setData({
          ...data,
          noOfCopies: val,
        });
        break;
      case "pageSizeFormat":
        setData({
          ...data,
          pageSizeFormat: val,
        });
        break;
      case "pageSides":
        setData({
          ...data,
          pageSides: val,
        });
        break;
    }
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex justify-center">
      <StepOne
        currentStep={currentStep}
        handleStepCounter={handleStepCounter}
        setSrcFile={setSrcFile}
        srcFile={srcFile}
        handleDataChange={handleDataChange}
      />
      <StepTwo
        currentStep={currentStep}
        handleStepCounter={handleStepCounter}
        srcFile={srcFile}
        data={data}
        handleDataChange={handleDataChange}
      />
    </div>
  );
}
