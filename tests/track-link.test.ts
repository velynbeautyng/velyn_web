import { describe, expect, it } from "vitest";
import { emailFromTrackToken, trackPath, trackToken } from "@/lib/track-link";

const SECRET = "test-secret";
const REF = "NB-MUY0VGN0-FF2F01";

describe("one-click tracking links", () => {
  it("carry the customer's email so the status shows straight away", () => {
    const token = trackToken(REF, "Ada@Example.com", SECRET);
    expect(emailFromTrackToken(REF, token, SECRET)).toBe("ada@example.com");
  });

  it("do not work for a different order", () => {
    const token = trackToken(REF, "ada@example.com", SECRET);
    expect(emailFromTrackToken("NB-OTHER-123456", token, SECRET)).toBeNull();
  });

  it("reject a token that has been edited", () => {
    const token = trackToken(REF, "ada@example.com", SECRET);
    const forged = token.replace(/^[^.]+/, Buffer.from("eve@example.com").toString("base64url"));
    expect(emailFromTrackToken(REF, forged, SECRET)).toBeNull();
    expect(emailFromTrackToken(REF, "garbage", SECRET)).toBeNull();
  });

  it("build the tracking path with the reference and the token", () => {
    const path = trackPath(REF, "ada@example.com", SECRET);
    expect(path).toMatch(/^\/track\?ref=NB-MUY0VGN0-FF2F01&k=[\w-]+\.[0-9a-f]+$/);
  });

  it("fall back to the reference alone when no secret is configured", () => {
    expect(trackPath(REF, "ada@example.com", "")).toBe(`/track?ref=${REF}`);
  });
});
