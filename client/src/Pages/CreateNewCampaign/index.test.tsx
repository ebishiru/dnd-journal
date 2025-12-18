import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import CreateNewCampaign from ".";

const renderComponent = (currentUser: string | null = null) => {
    render (
        <CurrentUserContext.Provider value={[currentUser, jest.fn()]}>
            <MemoryRouter initialEntries={["/manage/campaign/new"]}>
                <Routes>
                    <Route path="/" element={<p>Home Page</p>} />
                    <Route path="/manage/campaign/new" element={<CreateNewCampaign />} />
                </Routes>
            </MemoryRouter>
        </CurrentUserContext.Provider>
    )
}

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

global.fetch = jest.fn();

test("User gets redirected if not logged in", async () => {
    renderComponent(null);
    expect(await screen.findByText("Home Page")).toBeInTheDocument();
})

test("Form renders when logged in", () => {
    renderComponent("Kevin");
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/story/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create campaign/i })).toBeEnabled();
})