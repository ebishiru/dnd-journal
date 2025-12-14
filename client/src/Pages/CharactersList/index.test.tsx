import { render } from "@testing-library/react";
import CharactersList from ".";

test("Loading animation renders", () => {
    const { getByText, getByRole} = render(<CharactersList />);
    
    expect(getByText("Loading...")).toBeInTheDocument();
    expect(getByRole("img")).toHaveAttribute("src", "/fire.gif");
    }
)