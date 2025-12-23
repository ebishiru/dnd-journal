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
    global.fetch = jest.fn(async() => ({
        json: async () => ({
            status: 200,
            data: mockCharacter,
        }),
    })) as jest.Mock;
})

test("User gets redirected if not logged in", async () => {
    renderComponent(null);
    expect(await screen.findByText("Home Page")).toBeInTheDocument();
})

test("Form renders when logged in", async () => {
    renderComponent("Hopper");
    await screen.findByLabelText(/name/i);
    expect(screen.getByLabelText(/story/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save changes/i})).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete character/i})).toBeInTheDocument();
})

test("Quotes can be added and removed.", async () => {
    renderComponent("Hopper");
    await screen.findByText(/Add more quotes/i);
    const addQuoteButton = screen.getByRole("button", {name: /add more quotes/i});
    const removeQuoteButton = screen.getByRole("button", {name: /remove last quote/i});
    await userEvent.click(addQuoteButton);
    expect(await screen.findByLabelText(/3/)).toBeInTheDocument();
    await userEvent.click(removeQuoteButton);
    expect(screen.queryByLabelText(/3/)).not.toBeInTheDocument();
})

test("Character changes is saved successfully", async () => {
    global.fetch = jest.fn()
    .mockResolvedValueOnce({
        json: async () => ({
            status: 200,
            data: mockCharacter,
        }),
    })
    .mockResolvedValueOnce({
        json: async () => ({
            status: 202,
            message: "Character successfully updated.",
        }),
    }) as jest.Mock;
    renderComponent("Hopper");
    await screen.findByLabelText(/name/i);
    await userEvent.type(screen.getByLabelText(/story/i), "She saved Hawkins.");
    const saveChangesButton = screen.getByRole("button", {name: /save changes/i});
    await userEvent.click(saveChangesButton);

    expect(global.fetch).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Character successfully updated.");
    expect(toast.error).not.toHaveBeenCalled();
})

test("Character can be deleted", async () => {
    global.fetch = jest.fn()
    .mockResolvedValueOnce({
        json: async() => ({
            status: 200,
            data: mockCharacter,
        }),
    })
    .mockResolvedValueOnce({
        json: async () => ({
            status: 200,
            message: "Character successfully deleted.",
        }),
    }) as jest.Mock;
    renderComponent("Hopper");
    await screen.findByLabelText(/name/i);
    const deleteConfirmCheckBox = screen.getByRole("checkbox", {name: /i understand/i});
    const deleteCharacterButton = screen.getByRole("button", {name: /delete character/i});

    expect(deleteCharacterButton).toBeDisabled();
    
    await userEvent.click(deleteConfirmCheckBox);
    await userEvent.click(deleteCharacterButton);
    
    expect(global.fetch).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Character successfully deleted.");
    expect(toast.error).not.toHaveBeenCalled();
})