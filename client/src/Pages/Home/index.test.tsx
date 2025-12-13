import { render } from "@testing-library/react";
import Home from "../Home/index";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import { BrowserRouter } from "react-router-dom";

test("Home Page Paragraph text 1 appears", () => {
    const { getByText } = render(
        <BrowserRouter>
            <CurrentUserContext.Provider value={[null, jest.fn()]}>
                <Home />
            </CurrentUserContext.Provider>
        </BrowserRouter>
    );

    expect(getByText(/Every campaign starts small/i)).toBeInTheDocument();
}) 