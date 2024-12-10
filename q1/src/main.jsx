import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";

import EmailBody from "./components/EmailBody/EmailBody.jsx";

import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/:id" element={<EmailBody />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

