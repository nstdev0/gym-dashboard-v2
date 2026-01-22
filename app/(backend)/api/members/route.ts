import { createContext } from "@/server/lib/middleware";

export const GET = createContext(
  (container) => container.getAllMembersController,
);

export const POST = createContext(
  (container) => container.createMemberController,
);
