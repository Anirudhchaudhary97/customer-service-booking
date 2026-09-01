import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderAtRoute } from "../test/renderAtRoute";
import App from "../App";

describe("NotFoundPage", () => {
  it("renders the 404 page when navigating to an unknown route", async () => {
    renderAtRoute("/some-unknown-path", "/some-unknown-path", <App />);

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /page not found/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /browse available services/i })).toBeInTheDocument();
  });
});
