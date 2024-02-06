import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Context } from "../context/context";
import { useNavigate } from "react-router-dom";
import PdfViewer from "./PdfViewer";

function StepTwo({
  currentStep,
  handleStepCounter,
  srcFile,
  data,
  handleDataChange,
}) {
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState();
  const {
    sendingData,
    setSendingData,
    setLoading,
    loading,
    error,
    setError,
    networkError,
    setNetworkError,
  } = useContext(Context);
  const [show, setshow] = useState(false);
  const navigate = useNavigate();

  const calculateTotal = () => {
    let price = 0;
    if (data.noOfPages < 21) {
      if (data.pageSizeFormat === "A3") {
        price = data.grayOrColored === "Grayscale" ? 10 : 35;
      } else if (data.pageSizeFormat === "A4") {
        price = data.grayOrColored === "Grayscale" ? 3 : 10;
      }
    } else if (data.noOfPages < 100) {
      if (data.pageSizeFormat === "A3") {
        price = data.grayOrColored === "Grayscale" ? 7 : 28;
      } else if (data.pageSizeFormat === "A4") {
        price = data.grayOrColored === "Grayscale" ? 2 : 8;
      }
    } else {
      if (data.pageSizeFormat === "A3") {
        price = data.grayOrColored === "Grayscale" ? 5 : 20;
      } else if (data.pageSizeFormat === "A4") {
        price = data.grayOrColored === "Grayscale" ? 1 : 7;
      }
    }

    if (data.noOfPages < 0) {
      setError({
        noOfPages: true,
      });
      setTimeout(() => {
        setError({
          noOfPages: false,
        });
      }, 1500);
    }
    if (data.noOfCopies < 0) {
      setError({
        noOfCopies: true,
      });
      setTimeout(() => {
        setError({
          noOfCopies: false,
        });
      }, 1500);
    }

    if (data.noOfPages > 0 && data.noOfCopies > 0) {
      price = price * data.noOfPages * data.noOfCopies;
      setTotal(price);
      setSendingData({
        file: srcFile.file,
        phone: data.phone,
        noOfPages: data.noOfPages,
        pageSizeFormat: data.pageSizeFormat,
        grayOrColored: data.grayOrColored,
        noOfCopies: data.noOfCopies,
        pageSides: data.pageSides,
      });
    } else {
      setTotal(0);
    }
  };

  const initPay = (data) => {
    const options = {
      key: data.Key_Id,
      amount: data.amount,
      currency: data.currency,
      name: "RTP",
      order_id: data.id,
      handler: async (response) => {
        try {
          const resData = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/v1/payment/verify`,
            {
              ...response,
              amount: data.amount,
            }
          );
          setshow(true);
          setLoading(true);
          if (resData.data.success) {
            setSendingData({
              file: srcFile.file,
              phone: sendingData.phone,
              noOfPages: sendingData.noOfPages,
              pageSizeFormat: sendingData.pageSizeFormat,
              grayOrColored: sendingData.grayOrColored,
              noOfCopies: sendingData.noOfCopies,
              pageSides: sendingData.pageSides,
              order_ID: resData.data.order_id,
              payment_ID: resData.data.payment_id,
              amount: resData.data.amount,
            });
            setTimeout(() => {
              setLoading(false);
              navigate(`/payment-success`);
            }, 1500);
          }
        } catch (error) {
          setNetworkError(true);
          setTimeout(() => {
            setNetworkError(false);
          }, 1500);
        }
      },
      theme: {
        color: "#3399cc",
      },
    };
    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const handlePayment = async () => {
    try {
      if (
        data.noOfPages > 0 &&
        data.noOfCopies > 0 &&
        data.grayOrColored != "" &&
        data.pageSizeFormat != "" &&
        data.pageSides != ""
      ) {
        const details = {
          noOfPages: sendingData.noOfPages,
          pageSizeFormat: sendingData.pageSizeFormat,
          grayOrColored: sendingData.grayOrColored,
          noOfCopies: sendingData.noOfCopies,
        };
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/payment/order`,
          details
        );

        initPay(data.order);
      } else {
        setError({
          state: true,
        });
        setTimeout(() => {
          setError({
            state: false,
          });
        }, 2000);
      }
    } catch (error) {
      setNetworkError(true);
      setTimeout(() => {
        setNetworkError(false);
      }, 1500);
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [data]);
  console.log(srcFile.src)
  return (
    <>
      {networkError ? (
        <div
          className="alert alert-danger fixed z-10 top-0 w-full font-semibold text-sm md:text-md"
          role="alert"
        >
          !! Server Problem !!
        </div>
      ) : null}
      {error.state ? (
        <div
          className="alert alert-danger fixed z-10 top-0 w-full font-semibold text-sm md:text-md"
          role="alert"
        >
          !! Something is missing or invalid inputs !!
        </div>
      ) : null}
      {loading ? (
        <div className="absolute top-0 min-h-screen w-full flex justify-center items-center bg-white">
          <div>
            <div className="spinner-border w-24 h-24" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-lg font-bold md:text-xl mt-3">Loading..</p>
          </div>
        </div>
      ) : null}

      <div
        className={`w-full step-two ${currentStep !== 2 ? "hide" : ""} ${
          show ? "hidden" : "block"
        }`}
      >
        <h1 className="text-3xl my-2 p-2">Step Two</h1>
        <div className="flex mt-2 mb-5 flex-col gap-y-2  md:flex-row md:justify-center md:gap-x-2">
          <div className="preview bg-white border-2 py-2 mx-2 overflow-auto md:w-3/5  md:flex md:justify-center md:p-5 ">
            {srcFile.loading ? (
              <strong>Loading Preview...</strong>
            ) : srcFile.ext === "pdf" ? (
              <>
                {window.innerWidth > 768 ? (
                  <embed src={srcFile.src} className="w-full md:h-full" />
                ) : (
                  <>
                    <PdfViewer
                      pdfFile={srcFile.src}
                      setTotalPages={setTotalPages}
                    />
                    <p className="pt-2">Total Pages - {totalPages}</p>
                  </>
                )}
              </>
            ) : (
              <>
                <img src={srcFile.src} className="w-full h-fit" />
              </>
            )}
          </div>
          <div className="options bg-white mx-2 border-2 p-3 h-fit md:w-1/4  md:p-5">
            <div className="input-field">
              <label htmlFor="no_of_pages">No. of Pages</label>
              <input
                type="number"
                id="no_of_pages"
                className="pl-2 form-control"
                min="1"
                onChange={(e) => {
                  handleDataChange("noOfPages", e.target.value);
                }}
              />
              {error.noOfPages ? (
                <p className="text-red-600 text-start text-sm">
                  Value must be greater than 0
                </p>
              ) : null}
            </div>
            <div className="input-field">
              <label htmlFor="gray_or_colored">Grayscale/Colored</label>
              <select
                id="gray_or_colored"
                className="pl-2 form-control"
                onChange={(e) =>
                  handleDataChange("grayOrColored", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="Grayscale">Grayscale</option>
                <option value="Colored">Colored</option>
              </select>
            </div>
            <div className="input-field">
              <label htmlFor="no_of_copies">No. of Copies</label>
              <input
                type="number"
                id="no_of_copies"
                className="pl-2 form-control"
                min="1"
                onChange={(e) => handleDataChange("noOfCopies", e.target.value)}
              />
              {error.noOfCopies ? (
                <p className="text-red-600 text-start text-sm">
                  Value must be greater than 0
                </p>
              ) : null}
            </div>
            <div className="input-field">
              <label htmlFor="page_size_format">Page Size Format</label>
              <select
                id="page_size_format"
                className="pl-2 form-control"
                onChange={(e) =>
                  handleDataChange("pageSizeFormat", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="A3">A3</option>
                <option value="A4">A4</option>
              </select>
            </div>
            <div className="input-field">
              <label htmlFor="page_sides">One Sided/Double Sided</label>
              <select
                id="page_sides"
                className="pl-2 form-control"
                onChange={(e) => handleDataChange("pageSides", e.target.value)}
              >
                <option value="">Select</option>
                <option value="One">One Sided</option>
                <option value="Double">Double Sided</option>
              </select>
            </div>
            <div className="flex flex-col">
              <span className="total">Total : ₹ {total ? total + 2 : 0}</span>
              <div>
                <button onClick={() => handleStepCounter(-1)}>Prev</button>
                <button
                  onClick={handlePayment}
                  className={`${total ? "bg-blue-800 text-white" : ""}`}
                >
                  Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StepTwo;
