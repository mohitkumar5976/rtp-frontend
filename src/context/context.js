import { createContext, useState } from "react";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [sendingData, setSendingData] = useState({
    file: "",
    noOfPages: 0,
    grayOrColored: "",
    noOfCopies: 0,
    pageSizeFormat: "",
    pageSides: "",
    order_ID: "",
    payment_ID: "",
    amount: "",
  });
  const [shopId,setShopId] = useState("")
  const [phoneNo, setPhoneNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [error, setError] = useState({
    noOfPagesError: false,
    noOfCopiesError: false,
    state: false,
  });

  return (
    <Context.Provider
      value={{
        phoneNo,
        setPhoneNo,
        sendingData,
        setSendingData,
        loading,
        setLoading,
        error,
        setError,
        networkError,
        setNetworkError,
        shopId,setShopId
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
