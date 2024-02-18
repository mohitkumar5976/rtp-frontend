import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import StepThree from "./components/StepThree";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/payment-success" element={<StepThree />} />
          <Route path="/:id" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
