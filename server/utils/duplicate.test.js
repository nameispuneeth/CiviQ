import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

import Issue from "../models/issue.model.js";
import {
  distanceInMeters,
  findNearbyDuplicates,
  DUPLICATE_RADIUS_METERS,
} from "./duplicate.js";

// A reference point (MG Road, Bengaluru) plus offsets whose real-world
// distances are known, so the radius boundary can be tested precisely.
const BASE_LAT = 12.9716;
const BASE_LNG = 77.5946;
const LAT_22M = 12.9718; // ~22 m north
const LAT_44M = 12.972; // ~44 m north  (inside the 50 m radius)
const LAT_111M = 12.9726; // ~111 m north (outside the 50 m radius)

// Coordinates are stored as Strings in issue.model.js, so fixtures use
// strings deliberately — the parseFloat handling is part of what's tested.
const makeIssue = (overrides = {}) => ({
  _id: "issue-1",
  title: "Pothole near school",
  category: "Roads",
  status: "pending",
  latitude: String(BASE_LAT),
  longitude: String(BASE_LNG),
  report_count: 1,
  duplicate_of: null,
  ...overrides,
});

describe("distanceInMeters", () => {
  test("returns 0 for the same point", () => {
    expect(distanceInMeters(BASE_LAT, BASE_LNG, BASE_LAT, BASE_LNG)).toBe(0);
  });

  test("matches a known long-distance value (Bengaluru to Mysore ~128 km)", () => {
    const km = distanceInMeters(BASE_LAT, BASE_LNG, 12.2958, 76.6394) / 1000;
    expect(km).toBeCloseTo(128, 0);
  });

  test("measures a short north-south offset accurately", () => {
    expect(distanceInMeters(BASE_LAT, BASE_LNG, LAT_111M, BASE_LNG)).toBeCloseTo(111, 0);
  });

  test("is symmetric — order of the two points does not matter", () => {
    const forward = distanceInMeters(BASE_LAT, BASE_LNG, LAT_111M, BASE_LNG);
    const backward = distanceInMeters(LAT_111M, BASE_LNG, BASE_LAT, BASE_LNG);
    expect(forward).toBeCloseTo(backward, 6);
  });

  test("handles crossing the equator and prime meridian", () => {
    expect(distanceInMeters(-1, -1, 1, 1)).toBeGreaterThan(0);
  });
});

describe("findNearbyDuplicates", () => {
  beforeEach(() => {
    vi.spyOn(Issue, "find").mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("only queries unresolved, non-duplicate issues in the same category", async () => {
    await findNearbyDuplicates("Roads", BASE_LAT, BASE_LNG);

    expect(Issue.find).toHaveBeenCalledWith({
      category: "Roads",
      status: { $in: ["pending", "inprogress"] },
      duplicate_of: null,
    });
  });

  test("matches an issue inside the radius", async () => {
    Issue.find.mockResolvedValue([makeIssue({ latitude: String(LAT_44M) })]);

    const matches = await findNearbyDuplicates("Roads", BASE_LAT, BASE_LNG);

    expect(matches).toHaveLength(1);
    expect(matches[0].distance).toBeLessThanOrEqual(DUPLICATE_RADIUS_METERS);
  });

  test("rejects an issue outside the radius", async () => {
    Issue.find.mockResolvedValue([makeIssue({ latitude: String(LAT_111M) })]);

    const matches = await findNearbyDuplicates("Roads", BASE_LAT, BASE_LNG);

    expect(matches).toEqual([]);
  });

  test("honours a custom radius", async () => {
    Issue.find.mockResolvedValue([makeIssue({ latitude: String(LAT_111M) })]);

    const tooFar = await findNearbyDuplicates("Roads", BASE_LAT, BASE_LNG, 50);
    const withinWiderRadius = await findNearbyDuplicates("Roads", BASE_LAT, BASE_LNG, 300);

    expect(tooFar).toEqual([]);
    expect(withinWiderRadius).toHaveLength(1);
  });

  test("sorts matches nearest first", async () => {
    Issue.find.mockResolvedValue([
      makeIssue({ _id: "far", latitude: String(LAT_44M) }),
      makeIssue({ _id: "near", latitude: String(LAT_22M) }),
    ]);

    const matches = await findNearbyDuplicates("Roads", BASE_LAT, BASE_LNG);

    expect(matches.map((m) => m.issue._id)).toEqual(["near", "far"]);
    expect(matches[0].distance).toBeLessThan(matches[1].distance);
  });

  test("skips stored issues with unparseable coordinates instead of throwing", async () => {
    Issue.find.mockResolvedValue([
      makeIssue({ _id: "broken", latitude: "", longitude: "" }),
      makeIssue({ _id: "valid", latitude: String(LAT_22M) }),
    ]);

    const matches = await findNearbyDuplicates("Roads", BASE_LAT, BASE_LNG);

    expect(matches).toHaveLength(1);
    expect(matches[0].issue._id).toBe("valid");
  });

  test("returns nothing when the reporter has no location", async () => {
    // Happens whenever a citizen denies the browser geolocation prompt.
    expect(await findNearbyDuplicates("Roads", null, null)).toEqual([]);
    expect(await findNearbyDuplicates("Roads", undefined, undefined)).toEqual([]);
    expect(await findNearbyDuplicates("Roads", "not-a-number", "also-bad")).toEqual([]);
  });

  test("returns nothing when no category was chosen", async () => {
    expect(await findNearbyDuplicates("", BASE_LAT, BASE_LNG)).toEqual([]);
  });

  test("does not hit the database when inputs are invalid", async () => {
    await findNearbyDuplicates("", null, null);
    expect(Issue.find).not.toHaveBeenCalled();
  });

  test("reports the distance in whole metres alongside the issue", async () => {
    Issue.find.mockResolvedValue([makeIssue({ latitude: String(LAT_44M) })]);

    const [match] = await findNearbyDuplicates("Roads", BASE_LAT, BASE_LNG);

    expect(match.issue.title).toBe("Pothole near school");
    expect(Math.round(match.distance)).toBe(44);
  });
});
