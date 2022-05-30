import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MoralisProvider } from "react-moralis";

const root = ReactDOM.createRoot(document.getElementById("root"));

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const APP_ID = process.env.REACT_APP_APP_ID;

root.render(
	<React.StrictMode>
		<MoralisProvider serverUrl={SERVER_URL} appId={APP_ID}>
			<App />
		</MoralisProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();