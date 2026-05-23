import { Inngest } from "inngest";

/**
 * Stage 5b — Inngest client provisioned. Workers themselves land Week 7
 * (Stage 6 / AI layer). We keep the client + route handler in place so the
 * Stage 6 PR is purely about adding worker functions.
 */
export const inngest = new Inngest({
  id: "measured",
  name: "Measured Metabolics",
});
