const express = require("express");
const router = express.Router();
const { requireAuth } = require("../utils/auth.utils");

module.exports = (server) => {
  router.get("/api/devices", requireAuth, (req, res) => {
    const db = server.db.getState();

    if (!Array.isArray(db.devices)) {
      return res.status(404).send("Devices list not found");
    }

    res.json(db.devices);
  });

  router.patch("/api/devices/:deviceId", requireAuth, (req, res) => {
    const { deviceId } = req.params;
    const { state } = req.body;

    if (typeof state !== "boolean") {
      return res.status(400).send("Missing or invalid 'state'");
    }

    const db = server.db.getState();

    let found = false;

    const updatedDashboards = db.dashboards.map((dashboard) => ({
      ...dashboard,
      tabs: dashboard.tabs.map((tab) => ({
        ...tab,
        cards: tab.cards.map((card) => ({
          ...card,
          items: card.items.map((item) => {
            if (item.id === deviceId && item.type === "device") {
              found = true;
              return { ...item, state };
            }
            return item;
          }),
        })),
      })),
    }));

    const updatedDevices = Array.isArray(db.devices)
      ? db.devices.map((device) => {
          if (device.id === deviceId && device.type === "device") {
            found = true;
            return { ...device, state };
          }
          return device;
        })
      : db.devices;

    if (!found) {
      return res.status(404).send("Device not found");
    }

    server.db.setState({
      ...db,
      dashboards: updatedDashboards,
      devices: updatedDevices,
    });

    const updatedDevice =
      Array.isArray(updatedDevices) &&
      updatedDevices.find((d) => d.id === deviceId && d.type === "device");

    res.status(200).json(updatedDevice || { id: deviceId, state });
  });

  return router;
};
