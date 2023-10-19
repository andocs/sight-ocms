import React from "react";
import ReactDOM from "react-dom/client";

import { store } from "./app/store";
import { Provider } from "react-redux";

import App from "./App.jsx";

import "./fonts/Jost-Black.ttf";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</Provider>
);
