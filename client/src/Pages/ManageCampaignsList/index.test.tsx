import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ManageCampaignsList from ".";
import { CurrentUserContext } from "../../Context/CurrentUserContext";

const renderComponent = (currentUser: string | null = null) => {
    render (
        <CurrentUserContext.Provider value={[currentUser, jest.fn()]}>
            <MemoryRouter initialEntries={["/manage/campaigns"]}>
                <Routes>
                    <Route path="/" element={<p>Home Page</p>} />
                    <Route path="/manage/campaigns" element={<ManageCampaignsList />} />
                </Routes>
            </MemoryRouter>
        </CurrentUserContext.Provider>
    )
}

test("User gets redirected if not logged in", async () => {
    renderComponent();
    expect(await screen.findByText("Home Page")).toBeInTheDocument();
})

const mockCampaigns = [
    {
        _id: 1,
        title: "Water",
        author: "Kevin",
        createdAt: "21/02/2005"
    },
    {
        _id: 2,
        title: "Earth",
        author: "Kevin",
        createdAt: "17/03/2006"
    },
    {
        _id: 3,
        title: "Fire",
        author: "Kevin",
        createdAt: "21/09/2007"
    },
    {
        _id: 4,
        title: "Fake",
        author: "NoOne",
        createdAt: "06/07/2067"
    }
];
beforeEach(() => {
    global.fetch = jest.fn(async () => ({
        json: async () => ({
            status: 200,
            data: mockCampaigns,
        }),
    })) as jest.Mock;
})

test("Only campaigns by user renders properly after fetch", async () => {
    renderComponent("Kevin");

    expect(await screen.findByText("Water")).toBeInTheDocument();
    expect(await screen.findByText("Earth")).toBeInTheDocument();
    expect(await screen.findByText("Fire")).toBeInTheDocument();

    expect(screen.queryByText("Fake")).not.toBeInTheDocument();
})

test("Campaign links lead to correct url", async () => {
    renderComponent("Kevin");
    const links = await screen.findAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "/manage/campaign/1");
    expect(links[1]).toHaveAttribute("href", "/manage/campaign/2");
    expect(links[2]).toHaveAttribute("href", "/manage/campaign/3");
})

test("Campaigns can be sorted", async () => {
    renderComponent("Kevin");
    await screen.findByText("Water");
    const campaignSortButton = screen.getByText("Title").querySelector("button");
    if (!campaignSortButton) {
        throw new Error ("campaignSortButton is null");
    }
    await userEvent.click(campaignSortButton);
    const titles = screen.getAllByRole("link").map(link => link.textContent);

    expect(titles).toEqual(["Earth", "Fire", "Water"]);
})