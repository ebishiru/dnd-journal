import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import CurrentUserProvider from "./Context/CurrentUserContext.tsx";

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