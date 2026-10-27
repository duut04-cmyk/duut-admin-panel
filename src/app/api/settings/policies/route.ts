import { handleSettingsPoliciesPatch } from "@/lib/bff/settingsHandlers";

export async function PATCH(request: Request) {
  return handleSettingsPoliciesPatch(request);
}
