import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import CharactersList from ".";

test("Loading animation renders", () => {
    render(<CharactersList />);
    
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src", "/fire.gif");
})

//initialize mock fetch for Characters Data
const mockCharacters = [
    {
        _id: "1",
        name: "Steve",
        author: "Bravo",
        createdAt: "02/01/2024",
    },
    {
        _id: "2",
        name: "Alex",
        author: "Alpha",
        createdAt: "01/01/2023",
    },
    {
        _id: "3",
        name: "Ender",
        author: "Charlie",
        createdAt: "03/01/2022",
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

const renderComponent = () => {
    render (
        <BrowserRouter>
            <CharactersList />
        </BrowserRouter>
    )
}

test("Characters render after fetch", async () => {
    renderComponent();

    expect(await screen.findByText("Steve")).toBeInTheDocument();
    expect(await screen.findByText("Alex")).toBeInTheDocument();
    expect(await screen.findByText("Ender")).toBeInTheDocument();
});

test("Characters links lead to correct url", async () => {
    renderComponent();
    const links = await screen.findAllByRole("link");

    expect(links[0]).toHaveAttribute("href", "/character/1");
    expect(links[1]).toHaveAttribute("href", "/character/2");
    expect(links[2]).toHaveAttribute("href", "/character/3");
});

test("Characters are sorted by ascending order", async () => {
    renderComponent();
    await screen.findByText("Steve");
    const characterSortButton = screen.getByText("Character").querySelector("button");
    if (!characterSortButton) {
        throw new Error ("characterSortButton is null");
    }
    await userEvent.click(characterSortButton);
    const names = screen.getAllByRole("link").map(link => link.textContent);

    expect(names).toEqual(["Alex","Ender","Steve"]);
})