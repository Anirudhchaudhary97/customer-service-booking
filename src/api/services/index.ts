import { mockHttpClient } from "../mock/mockHttpClient";
// import { createFetchHttpClient } from "../client/fetchHttpClient";
import { createServicesApi } from "./servicesApi";
import { createBookingsApi } from "./bookingsApi";

/**
 * Single composition point for the whole API surface.
 *
 */
const client = mockHttpClient;

export const servicesApi = createServicesApi(client);
export const bookingsApi = createBookingsApi(client);
