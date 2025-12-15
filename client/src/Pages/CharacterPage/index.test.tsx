import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CharacterPage from ".";

test("Loading animation renders", () => {
    render(<CharacterPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute("src","/fire.gif");
})

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

beforeEach(() => {
    global.fetch = jest.fn(async() => ({
        json: async () => ({
            status: 200,
            data: mockCharacter,
        }),
    })) as jest.Mock;
})

const renderComponent = () => {
    render (
        <MemoryRouter initialEntries={["/character/011"]}>
            <Routes>
                <Route path="/character/:_id" element={<CharacterPage />} />
            </Routes>
        </MemoryRouter>
    )
}

test("Character info renders after fetch", async () => {
    renderComponent();

    expect(await screen.findByText(/Eleven/)).toBeInTheDocument();
    expect(await screen.findByText("Hopper")).toBeInTheDocument();
    expect(await screen.findByText("Bitchin")).toBeInTheDocument();
})