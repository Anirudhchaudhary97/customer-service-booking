import { describe, expect, it, vi, afterEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderAtRoute } from "../../../test/renderAtRoute";
import { ServiceListPage } from "./ServiceListPage";
import { ApiError } from "../../../types/api";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ServiceListPage", () => {
  it("shows a loading state and then renders services on success", async () => {
    renderAtRoute("/services", "/services", <ServiceListPage />);

    expect(screen.getByText(/loading services/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByTestId("service-card").length).toBeGreaterThan(0);
    });

    expect(screen.getByText("Deep Home Cleaning")).toBeInTheDocument();
  });

  it("shows an empty state when the search has no matches", async () => {
    renderAtRoute("/services", "/services", <ServiceListPage />);

    await waitFor(() => {
      expect(screen.getAllByTestId("service-card").length).toBeGreaterThan(0);
    });

    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/search services/i), "zzz-no-such-service-zzz");

    await waitFor(() => {
      expect(screen.getByText(/no services match your search/i)).toBeInTheDocument();
    });
    expect(screen.queryByTestId("service-card")).not.toBeInTheDocument();
  });

  it("shows an error state with a retry action when the request fails", async () => {
    const servicesApiModule = await import("../../../api/services");
    const spy = vi
      .spyOn(servicesApiModule.servicesApi, "listServices")
      .mockRejectedValueOnce(new ApiError(500, { code: "SERVER_ERROR", message: "The server had a problem." }));

    renderAtRoute("/services", "/services", <ServiceListPage />);

    await waitFor(() => {
      expect(screen.getByText(/the server had a problem/i)).toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    expect(spy).toHaveBeenCalled();
  });
});
