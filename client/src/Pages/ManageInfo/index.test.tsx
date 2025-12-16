import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ManageInfo from ".";
import { CurrentUserContext } from "../../Context/CurrentUserContext";

const renderComponent = (currentUser: string | null = null) => {
    render (
        <CurrentUserContext.Provider value={[currentUser, jest.fn()]}>
            <MemoryRouter initialEntries={["/manage"]}>
                <Routes>
                    <Route path="/" element={<p>Home Page</p>} />
                    <Route path="/manage" element={<ManageInfo />} />
                </Routes>
            </MemoryRouter>
        </CurrentUserContext.Provider>
    )
}

test("User gets redirected if not logged in", async () => {
    renderComponent(null);
    expect(await screen.findByText("Home Page")).toBeInTheDocument();
})

test("Content renders when logged in", () => {
    renderComponent("Kevin");
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByText(/Create new Character/i)).toBeInTheDocument();
})