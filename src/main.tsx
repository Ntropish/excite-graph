import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "hsla(170, 50%, 50%, 1)",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename="/excite-graph">
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
