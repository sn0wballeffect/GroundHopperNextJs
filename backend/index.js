const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());

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
      whereClause.AND = [
        { latitude: { not: null } },
        { longitude: { not: null } },
      ];

      const radius = parseFloat(distance);
      const latVal = parseFloat(lat);
      const lngVal = parseFloat(lng);

      whereClause.OR = [
        {
          AND: [
            {
              latitude: {
                gte: latVal - radius / 111.32,
                lte: latVal + radius / 111.32,
              },
            },
            {
              longitude: {
                gte: lngVal - radius / 111.32,
                lte: lngVal + radius / 111.32,
              },
            },
          ],
        },
      ];
    }

    const matches = await prisma.table.findMany({
      where: whereClause,
      orderBy: {
        event_date: "asc",
      },
      take: parseInt(limit), // Add limit
    });

    res.json(matches);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
