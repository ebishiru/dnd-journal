import { render } from "@testing-library/react";
import Home from "../Home/index";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import { BrowserRouter } from "react-router-dom";

test("Home Page Paragraph texts appears", () => {
    const { getByText } = render(
        <BrowserRouter>
            <CurrentUserContext.Provider value={[null, jest.fn()]}>
                <Home />
            </CurrentUserContext.Provider>
        </BrowserRouter>
    );

    expect(getByText(/Every campaign starts small/i)).toBeInTheDocument();
    expect(getByText(/Dungeon Notes Database/i)).toBeInTheDocument();
    expect(getByText(/Take a seat and write your tale/i)).toBeInTheDocument();
}) 

test("Log in button appears when not logged in", () => {
    const { getByText } = render(
        <BrowserRouter>
            <CurrentUserContext.Provider value={[null, jest.fn()]}>
                <Home />
            </CurrentUserContext.Provider>
        </BrowserRouter>
    )

    expect(getByText("Log In")).toBeInTheDocument();
})

test("Manage info and Log out button appears when logged in", () => {
    const mockSetUser = jest.fn();
    const { getByText, queryByText } = render(
        <BrowserRouter>
            <CurrentUserContext.Provider value={["Test.Account", mockSetUser]}>
                <Home />
            </CurrentUserContext.Provider>
        </BrowserRouter>
    )

    expect(getByText("Log Out")).toBeInTheDocument();
    expect(getByText("Manage Info")).toBeInTheDocument();
    expect(queryByText("Log In")).toBeNull();
})