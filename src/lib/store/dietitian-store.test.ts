import { afterEach, describe, expect, it } from "vitest";
import { useDietitianQueue } from "./dietitian-store";

afterEach(() => {
  useDietitianQueue.getState().reset();
});

describe("useDietitianQueue", () => {
  it("starts at cursor 0 with pending_review filter", () => {
    const s = useDietitianQueue.getState();
    expect(s.cursor).toBe(0);
    expect(s.filter.reviewStatus).toBe("pending_review");
    expect(s.editing).toBe(false);
  });

  it("recordAction advances cursor, exits edit mode, and appends to history", () => {
    const s = useDietitianQueue.getState();
    s.toggleEditing();
    expect(useDietitianQueue.getState().editing).toBe(true);
    s.recordAction("m-1", "approved");
    const next = useDietitianQueue.getState();
    expect(next.cursor).toBe(1);
    expect(next.editing).toBe(false);
    expect(next.actedThisSession).toHaveLength(1);
    expect(next.actedThisSession[0]).toMatchObject({
      id: "m-1",
      action: "approved",
    });
  });

  it("setFilter resets cursor", () => {
    const s = useDietitianQueue.getState();
    s.setCursor(5);
    expect(useDietitianQueue.getState().cursor).toBe(5);
    s.setFilter({ patientId: "asha" });
    const next = useDietitianQueue.getState();
    expect(next.cursor).toBe(0);
    expect(next.filter.patientId).toBe("asha");
  });

  it("setCursor floors at 0", () => {
    useDietitianQueue.getState().setCursor(-3);
    expect(useDietitianQueue.getState().cursor).toBe(0);
  });
});
