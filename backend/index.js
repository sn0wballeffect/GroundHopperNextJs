const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());

// Add Haversine distance helper function
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Routes
app.get("/matches", async (req, res) => {
  try {
    const {
      sport,
      dateFrom,
      dateTo,
      distance,
      lat,
      lng,
      limit = 100,
    } = req.query;

    let whereClause = {};

    // Sport filter
    if (sport) {
      whereClause.sport = sport;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      whereClause.event_date = {
        ...(dateFrom && { gte: new Date(dateFrom) }),
        ...(dateTo && { lte: new Date(dateTo) }),
      };
    }

    // Location and distance filter
    if (lat && lng && distance) {
      const radius = parseFloat(distance);
      const latVal = parseFloat(lat);
      const lngVal = parseFloat(lng);

      // Create bounding box for initial filtering
      const latRadius = radius / 111.32;
      const lonRadius = radius / (111.32 * Math.cos((latVal * Math.PI) / 180));

      whereClause.AND = [
        { latitude: { not: null } },
        { longitude: { not: null } },
        {
          latitude: {
            gte: latVal - latRadius,
            lte: latVal + latRadius,
          },
        },
        {
          longitude: {
            gte: lngVal - lonRadius,
            lte: lngVal + lonRadius,
          },
        },
      ];

      // Get matches within bounding box
      let matches = await prisma.table.findMany({
        where: whereClause,
        orderBy: [{ event_date: "asc" }, { event_time: "asc" }],
        take: parseInt(limit),
      });

      // Apply precise Haversine filter
      matches = matches.filter((match) => {
        const dist = haversineDistance(
          latVal,
          lngVal,
          match.latitude,
          match.longitude
        );
        return dist <= radius;
      });

      return res.json(matches);
    }

    // Handle non-location based queries
    const matches = await prisma.table.findMany({
      where: whereClause,
      orderBy: [
        {
          event_date: "asc",
        },
        {
          event_time: "asc",
        },
      ],
      take: parseInt(limit), // Add limit
    });

    res.json(matches);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/cities", async (req, res) => {
  try {
    const { search } = req.query;

    if (!search || search.length < 2) {
      return res.json([]);
    }

    const cities = await prisma.cities.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: search,
            },
          },
          {
            ascii_name: {
              startsWith: search,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        ascii_name: true,
        latitude: true,
        longitude: true,
        population: true,
      },
      orderBy: {
        population: "desc",
      },
      take: 5,
    });

    res.json(cities);
  } catch (error) {
    console.error("Error searching cities:", error);
    res.status(500).json({ error: "Failed to search cities" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
