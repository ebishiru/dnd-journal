import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import CampaignsList from ".";

test("Loading animation appears", () => {
    render(<CampaignsList />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/fire.gif");
})

//initialize mock campaigns data;
const mockCampaigns = [
    {
        _id: 1,
        title: "Water",
        author: "Katara",
        createdAt: "21/02/2005"
    },
    {
        _id: 2,
        title: "Earth",
        author: "Toph",
        createdAt: "17/03/2006"
    },
    {
        _id: 3,
        title: "Fire",
        author: "Zuko",
        createdAt: "21/09/2007"
    }
];
beforeEach(() => {
    global.fetch = jest.fn(async() => ({
        json: async () => ({
            status: 200,
            data: mockCampaigns
        }),
    })) as jest.Mock;
})

const renderComponent = () => {
    render (
        <BrowserRouter>
            <CampaignsList />
        </BrowserRouter>
    )
}

test("Campaigns render after fetch", async () => {
    renderComponent();

    expect(await screen.findByText("Water")).toBeInTheDocument();
    expect(await screen.findByText("Earth")).toBeInTheDocument();
    expect(await screen.findByText("Fire")).toBeInTheDocument();
})

test("Campaigns links lead to correct url", async () => {
    renderComponent();
    const links = await screen.findAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "/campaign/1");
    expect(links[1]).toHaveAttribute("href", "/campaign/2");
    expect(links[2]).toHaveAttribute("href", "/campaign/3");
})

test("Campaigns can be sorted alphabetically", async () => {
    renderComponent();
    await screen.findByText("Water");
    const campaignSortButton = screen.getByText("Title").querySelector("button");
    if (!campaignSortButton) {
        throw new Error ("campaignSortButton is null");
    }
    await userEvent.click(campaignSortButton);
    const titles = screen.getAllByRole("link").map(link => link.textContent);

    expect(titles).toEqual(["Earth", "Fire", "Water"]);
})