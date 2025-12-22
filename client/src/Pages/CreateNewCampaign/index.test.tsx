import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { CurrentUserContext } from "../../Context/CurrentUserContext";
import CreateNewCampaign from ".";
import { toast } from "sonner";

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
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/story/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create campaign/i })).toBeEnabled();
})

test("Form successfully saves and campaign is created", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
        json: async () => ({
            status: 201,
            message: "Campaign successfully created.",
        })
    })
    renderComponent("Kevin");
    await screen.findByText("Create Campaign");
    await userEvent.type(screen.getByLabelText(/title/i),"Test Campaign");
    await userEvent.type(screen.getByLabelText(/story/i),"Test Story");
    const campaignCreateButton = screen.getByRole("button", {name: /create campaign/i});
    await userEvent.click(campaignCreateButton);
    
    expect(global.fetch).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Campaign successfully created.");
    expect(toast.error).not.toHaveBeenCalled();
})