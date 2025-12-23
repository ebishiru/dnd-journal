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

test("Quotes can be added and removed.", async () => {
    renderComponent("Kevin");
    await screen.findByText(/Add more quotes/i);
    const addQuoteButton = screen.getByRole("button", {name: /add more quotes/i});
    const removeQuoteButton = screen.getByRole("button", {name: /remove last quote/i});
    await userEvent.click(addQuoteButton);
    expect(await screen.getByLabelText(/2/)).toBeInTheDocument();
    await userEvent.click(removeQuoteButton);
    expect(screen.queryByLabelText(/2/)).not.toBeInTheDocument();
})

test("Character can be created", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
            status: 201,
            message: "Character successfully created.",
        })
    })
    renderComponent("Kevin");
    await screen.findByText(/summon forth/i);
    await userEvent.type(screen.getByLabelText(/name/i),"Test Name");
    await userEvent.type(screen.getByLabelText(/story/i),"Test Story");
    await userEvent.type(screen.getByLabelText(/1/),"Test Quote");
    const characterCreateButton = screen.getByRole("button", {name: /create character/i});
    await userEvent.click(characterCreateButton);

    expect(global.fetch).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Character successfully created.");
    expect(toast.error).not.toHaveBeenCalled();
})