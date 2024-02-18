import React, { useContext, useEffect, useState } from "react";
import { Context } from "../context/context";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";

function StepThree() {
  const {
    sendingData,
    networkError,
    setNetworkError,
    phoneNo,
    setPhoneNo,
    shopId,
    setShopId,
  } = useContext(Context);
  const [paymentID, setPaymentID] = useState("");
  const navigate = useNavigate();

  const saveData = async () => {
    try {
      if (
        sendingData.payment_ID != "" &&
        sendingData.order_ID != "" &&
        shopId !== ""
      ) {
        const formData = new FormData();
        formData.append("shopId", shopId);
        formData.append("phoneNo", phoneNo);
        formData.append("noOfPages", sendingData.noOfPages);
        formData.append("pageSizeFormat", sendingData.pageSizeFormat);
        formData.append("grayOrColored", sendingData.grayOrColored);
        formData.append("noOfCopies", sendingData.noOfCopies);
        formData.append("pageSides", sendingData.pageSides);
        formData.append("order_ID", sendingData.order_ID);
        formData.append("payment_ID", sendingData.payment_ID);
        formData.append("amount", sendingData.amount);
        formData.append("file", sendingData.file);

        await axios
          .post(`${process.env.REACT_APP_API_URL}/api/v1/details`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            setPaymentID(res.data.printableData.paymentId);
            setPhoneNo("");
            setShopId("");
          });
      } else {
        navigate("/");
      }
    } catch (error) {
      setNetworkError(true);
      setTimeout(() => {
        setNetworkError(false);
      }, 1500);
    }
  };

  useEffect(() => {
    saveData();
  }, []);

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

      <div className="w-full min-h-screen flex justify-center">
        <div className="pt-5">
          <h1
            className="text-center text-3xl md:text-4xl mb-2"
            style={{ fontFamily: "Balsamiq Sans, sans-serif" }}
          >
            Payment successful
          </h1>
          <h3
            className="text-xl text-center md:text-xl"
            style={{ fontFamily: "Balsamiq Sans, sans-serif" }}
          >
            Print will be produced shortly
          </h3>

          <CheckBadgeIcon className="w-48 h-48 text-green-700 mx-auto my-2" />

          <div>
            <span>
              <strong>Success</strong>
            </span>
            <p>
              <strong>Payment ID : {paymentID}</strong>
            </p>
          </div>
          <div className="mt-3 flex items-center flex-col gap-y-2">
            <span
              className="text-3xl"
              style={{ fontFamily: "Balsamiq Sans, sans-serif" }}
            >
              track
            </span>
            <Link
              to="/"
              className="bg-blue-800 text-white w-fit rounded-lg px-3 py-2"
            >
              Go To Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default StepThree;
