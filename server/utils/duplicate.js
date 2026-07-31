const Issue = require("../models/issue.model");

const DUPLICATE_RADIUS_METERS = 50;

const toRadians = (deg) => (deg * Math.PI) / 180;

function distanceInMeters(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(a));
}

async function findNearbyDuplicates(category, latitude, longitude, radius = DUPLICATE_RADIUS_METERS) {
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  if (!category || Number.isNaN(lat) || Number.isNaN(lng)) return [];

  // Only unresolved issues count as duplicates — a match against a resolved
  // issue is a recurrence of a fixed problem, which admins need to see as new.
  const candidates = await Issue.find({
    category,
    status: { $in: ["pending", "inprogress"] },
    duplicate_of: null,
  });

  return candidates
    .map((issue) => {
      const issueLat = parseFloat(issue.latitude);
      const issueLng = parseFloat(issue.longitude);
      if (Number.isNaN(issueLat) || Number.isNaN(issueLng)) return null;
      return { issue, distance: distanceInMeters(lat, lng, issueLat, issueLng) };
    })
    .filter((match) => match && match.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
}

module.exports = { findNearbyDuplicates, distanceInMeters, DUPLICATE_RADIUS_METERS };
