import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import ManageCharacter from ".";
import { toast } from "sonner";

//initialize mock Character Data
const mockCharacter = {
    _id: "011",
    name: "Jane Ives, AKA Eleven",
    author: "Hopper",
    createdAt: "07/06/1971",
    lastEdit: "31/12/2025",
    story: "She was a test subject.",
    quotes: ["Friends don't lie", "Bitchin"],
}

const renderComponent = (currentUser: string | null = null) => {
    render (
        <CurrentUserContext.Provider value={[currentUser, jest.fn()]}>
            <MemoryRouter initialEntries={["/manage/character/011"]}>
                <Routes>
                    <Route path="/" element={<p>Home Page</p>} />
                    <Route path="/manage/character/011" element={<ManageCharacter />} />
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
    renderComponent("Hopper");
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/story/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create character/i})).toBeInTheDocument();
})