import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ManageCharactersList from ".";
import { CurrentUserContext } from "../../Context/CurrentUserContext";

test("Loading animation appears", () => {
    renderComponent("Kevin");

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/fire.gif");
})

const renderComponent = (currentUser: string | null = null) => {
    render (
        <CurrentUserContext.Provider value={[currentUser, jest.fn()]}>
            <MemoryRouter initialEntries={["/manage/characters"]}>
                <Routes>
                    <Route path="/" element={<p>Home Page</p>} />
                    <Route path="/manage/characters" element={<ManageCharactersList />} />
                </Routes>
            </MemoryRouter>
        </CurrentUserContext.Provider>
    )
}

test("User is redirected if not logged in", async () => {
    renderComponent(null);
    expect(await screen.findByText("Home Page")).toBeInTheDocument();
})

const mockCharacters = [
    {
        _id: "1",
        name: "Steve",
        author: "Kevin",
        createdAt: "02/01/2024",
    },
    {
        _id: "2",
        name: "Alex",
        author: "Kevin",
        createdAt: "01/01/2023",
    },
    {
        _id: "3",
        name: "Ender",
        author: "Kevin",
        createdAt: "03/01/2022",
    },
    {
        _id: "4",
        name: "Pig",
        author: "Notch",
        createdAt: "06/07/2067"
    }
]
beforeEach(() => {
    global.fetch = jest.fn(async() => ({
        json: async () => ({
            status: 200,
            data: mockCharacters,
        }),
    })) as jest.Mock;
})

test("All Characters that belong to currentUser renders", async () => {
    renderComponent("Kevin");
    
    expect(await screen.findByText("Steve")).toBeInTheDocument();
    expect(await screen.findByText("Alex")).toBeInTheDocument();
    expect(await screen.findByText("Ender")).toBeInTheDocument();

    expect(screen.queryByText("Pig")).not.toBeInTheDocument();
})

test("Character links lead to correct url", async () => {
    renderComponent("Kevin");
    const links = await screen.findAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "/manage/character/1");
    expect(links[1]).toHaveAttribute("href", "/manage/character/2");
    expect(links[2]).toHaveAttribute("href", "/manage/character/3");
})

test("Characters can be sorted", async () => {
    renderComponent("Kevin");
    await screen.findByText("Steve");
    const characterSortButton = screen.getByText("Character").querySelector("button");
    if (!characterSortButton) {
        throw new Error ("characterSortButton is null");
    }
    await userEvent.click(characterSortButton);
    const names = screen.getAllByRole("link").map(link => link.textContent);

    expect(names).toEqual(["Alex", "Ender", "Steve"]);
})