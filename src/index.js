import React from "react";
// import ReactDOM from "react-dom/client";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import reportWebVitals from "./reportWebVitals";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <Provider store={store}>
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   </Provider>
// );
ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
      {/* </DataProvider> */}
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
reportWebVitals();
