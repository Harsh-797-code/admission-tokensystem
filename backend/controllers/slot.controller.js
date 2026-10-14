import db from "../db.js";

// Create a new admission slot
export async function createSlot(req, res) {
  try {
    const { slotTime, capacity } = req.body;

    // Validation
    if (!slotTime) {
      return res.status(400).json({
        status: "error",
        message: "slotTime is required",
      });
    }

    const parsedCapacity = Number(capacity);

    if (
      !Number.isInteger(parsedCapacity) ||
      parsedCapacity <= 0
    ) {
      return res.status(400).json({
        status: "error",
        message: "capacity must be a positive integer",
      });
    }

    const result = await db.query(
      `
      INSERT INTO slots (slot_time, capacity)
      VALUES ($1, $2)
      RETURNING id, slot_time, capacity, booked_count, created_at
      `,
      [slotTime, parsedCapacity]
    );

    return res.status(201).json({
      status: "success",
      message: "Slot created successfully",
      slot: result.rows[0],
    });
  } catch (error) {
    console.error("Create slot error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to create slot",
    });
  }
}

// Get all admission slots
export async function getSlots(req, res) {
  try {
    const result = await db.query(`
      SELECT
        id,
        slot_time,
        capacity,
        booked_count,
        (capacity - booked_count) AS available_count
      FROM slots
      ORDER BY slot_time ASC
    `);

    return res.status(200).json({
      status: "success",
      slots: result.rows,
    });
  } catch (error) {
    console.error("Get slots error:", error);

    return res.status(500).json({
      status: "error",
      message: "Failed to fetch slots",
    });
  }
}