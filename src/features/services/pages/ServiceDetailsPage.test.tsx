import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderAtRoute } from "../../../test/renderAtRoute";
import { ServiceDetailsPage } from "./ServiceDetailsPage";

describe("ServiceDetailsPage", () => {
  it("renders service details for a valid service id", async () => {
    renderAtRoute("/services/:serviceId", "/services/svc-001", <ServiceDetailsPage />);

    expect(screen.getByText(/loading service details/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Deep Home Cleaning" })).toBeInTheDocument();
    });

    expect(screen.getAllByText("Clara Nguyen").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /choose a time/i })).toBeEnabled();
  });

  it("shows a 404 error state for an unknown service id", async () => {
    renderAtRoute("/services/:serviceId", "/services/does-not-exist", <ServiceDetailsPage />);

    await waitFor(() => {
      expect(screen.getByText(/was not found/i)).toBeInTheDocument();
    });
  });
});
