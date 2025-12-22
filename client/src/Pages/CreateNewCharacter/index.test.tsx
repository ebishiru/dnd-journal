import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import CreateNewCharacter from ".";
import { toast } from "sonner";

const renderComponent = (currentUser: string | null = null) => {
    render (
        <CurrentUserContext.Provider value={[currentUser, jest.fn()]}>
            <MemoryRouter initialEntries={["/manage/character/new"]}>
                <Routes>
                    <Route path="/" element={<p>Home Page</p>} />
                    <Route path="/manage/character/new" element={<CreateNewCharacter />} />
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

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
})

test("User gets redirected if not logged in", async () => {
    renderComponent(null);
    expect(await screen.findByText("Home Page")).toBeInTheDocument();
})

test("Form renders when logged in", () => {
    renderComponent("Kevin");
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/story/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create character/i})).toBeInTheDocument();
})