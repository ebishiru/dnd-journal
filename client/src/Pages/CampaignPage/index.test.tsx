import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CampaignPage from ".";

test("Loading animation appears", () => {
    render(<CampaignPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/fire.gif");
})

const mockCampaign = {
    _id: 1,
    title: "Leaves From The Vine",
    author: "Iroh",
    story: "Happy Birthday my son. If only I could have helped you",
    createdAt: "01/01/2001",
    lastEdit: "01/01/2001",
}
beforeEach(() => {
    global.fetch = jest.fn(async () => ({
        json: async () => ({
            status: 200,
            data: mockCampaign,
        }),
    })) as jest.Mock;
})

const renderComponent = () => {
    render (
        <MemoryRouter initialEntries={["/campaign/1"]}>
            <Routes>
                <Route path="campaign/:_id" element={<CampaignPage />} />
            </Routes>
        </MemoryRouter>
    )
}

test("Campaign info renders", async () => {
    renderComponent();

    expect(await screen.findByText("Leaves From The Vine")).toBeInTheDocument();
    expect(await screen.findByText(/helped you/)).toBeInTheDocument();
})