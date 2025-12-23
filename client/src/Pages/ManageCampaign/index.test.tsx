import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import ManageCampaign from ".";
import { toast } from "sonner";

const mockCampaign = {
    _id: 1,
    title: "Leaves From The Bine",
    author: "Iroh",
    story: "Happy Birthday my son. If only I could have helped you",
    createdAt: "01/01/2001",
    lastEdit: "01/01/2001",
}

const renderComponent = (currentUser: string | null = null) => {
    render (
        <CurrentUserContext.Provider value={[currentUser, jest.fn()]}>
            <MemoryRouter initialEntries={["/manage/campaign/1"]}>
                <Routes>
                    <Route path="/" element={<p>Home Page</p>} />
                    <Route path="/manage/campaign/1" element={<ManageCampaign />} />
                </Routes>
            </MemoryRouter>
        </CurrentUserContext.Provider>
    )
}

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    }
}))

beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(async() => ({
        json: async () => ({
            status: 200,
            data: mockCampaign,
        }),
    })) as jest.Mock;
})

test("User gets redirected if not logged in", async () => {
    renderComponent(null);
    expect(await screen.findByText("Home Page")).toBeInTheDocument();
})

test("Form renders when logged in", async () => {
    renderComponent("Iroh");
    await screen.findByLabelText(/title/i);
    expect(screen.getByLabelText(/story/i)).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /save changes/i})).toBeInTheDocument();
    expect(screen.getByRole("button", {name: /delete campaign/i})).toBeInTheDocument();
})

test("Campaign can be editted and saved", async () => {
    global.fetch = jest.fn()
    .mockResolvedValueOnce({
        json: async () => ({
            status: 200,
            data: mockCampaign,
        }),
    })
    .mockResolvedValueOnce({
        json: async () => ({
            status: 202,
            message: "Campaign successfully updated.",
        }),
    }) as jest.Mock;
    renderComponent("Iroh");
    await screen.findByLabelText(/title/i);
    await userEvent.type(screen.getByLabelText(/title/i), "Leaves from the Vine");
    const saveChangesButton = screen.getByRole("button", {name: /save changes/i});
    await userEvent.click(saveChangesButton);

    expect(global.fetch).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Campaign successfully updated.");
    expect(toast.error).not.toHaveBeenCalled();
})

test("Campaign can be deleted", async () => {
    global.fetch = jest.fn()
    .mockResolvedValueOnce({
        json: async() => ({
            status: 200,
            data: mockCampaign,
        }),
    })
    .mockResolvedValueOnce({
        json: async () => ({
            status: 200,
            message: "Campaign successfully deleted.",
        }),
    }) as jest.Mock;
    renderComponent("Iroh");
    await screen.findByLabelText(/title/i);
    const deleteConfirmCheckBox = screen.getByRole("checkbox", {name: /i understand/i});
    await userEvent.click(deleteConfirmCheckBox);
    const deleteCampaignButton = screen.getByRole("button", {name: /delete campaign/i});
    await userEvent.click(deleteCampaignButton);
    
    expect(global.fetch).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Campaign successfully deleted.");
    expect(toast.error).not.toHaveBeenCalled();
})