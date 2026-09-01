import { useMemo, useState } from "react";
import { useApiRequest } from "../../../hooks/useApiRequest";
import { servicesApi } from "../../../api/services";

export function useServiceList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");

  const params = useMemo(() => ({ search, category }), [search, category]);

  const request = useApiRequest(
    () => servicesApi.listServices(params),
    [search, category],
  );

  return { ...request, search, setSearch, category, setCategory };
}
