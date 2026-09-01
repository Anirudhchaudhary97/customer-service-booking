import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

/**
 * Renders a routed component at a given path so `useParams`/`useNavigate`
 * work the same way they do in the real app, without needing the full
 * `App` shell (nav, etc.) for every test.
 */
export function renderAtRoute(routePath: string, initialPath: string, element: ReactElement) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path={routePath} element={element} />
      </Routes>
    </MemoryRouter>,
  );
}
