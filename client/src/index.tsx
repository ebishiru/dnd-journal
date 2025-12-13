import ReactDOM from "react-dom/client";
import App from "./App";
import CurrentUserProvider from "./Context/CurrentUserContext";

const rootElement = document.getElementById("root");
if(!rootElement) {
    throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);

root.render(
    <>
        <CurrentUserProvider>
            <App />
        </CurrentUserProvider>
    </>
)