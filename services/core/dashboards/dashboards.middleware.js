const express = require("express");
const router = express.Router();
const { requireAuth } = require("../utils/auth.utils");

module.exports = (server) => {
  const getDb = () => server.db.getState();
  const getDbDashboards = () => getDb().dashboards;

  router.get("/api/dashboards", requireAuth, (req, res) => {
    const dashboards = getDbDashboards().map(({ id, title, icon }) => ({
      id,
      title,
      icon,
    }));
    res.json(dashboards);
  });

  router.get("/api/dashboards/:dashboardId", requireAuth, (req, res) => {
    const { dashboardId } = req.params;
    const dashboard = getDbDashboards().find((d) => d.id === dashboardId);

    if (!dashboard) {
      return res.status(404).send("Dashboard not found");
    }

    res.json({ tabs: dashboard.tabs || [] });
  });

  router.post("/api/dashboards/:dashboardId", requireAuth, (req, res) => {
    const { dashboardId } = req.params;
    const { tabs } = req.body;

    if (!Array.isArray(tabs)) {
      return res.status(400).send("Invalid or missing 'tabs' in request body");
    }

    const db = getDb();
    const dashboards = db.dashboards;

    const found = dashboards.some((d) => d.id === dashboardId);
    if (!found) {
      return res.status(404).send("Dashboard not found");
    }

    const updatedDashboards = dashboards.map((dashboard) =>
      dashboard.id === dashboardId ? { ...dashboard, tabs } : dashboard
    );

    server.db.setState({
      ...db,
      dashboards: updatedDashboards,
    });

    const updatedDashboard = updatedDashboards.find((d) => d.id === dashboardId);
    res.status(200).json(updatedDashboard);
  });

  router.delete("/api/dashboards/:dashboardId", requireAuth, (req, res) => {
    const { dashboardId } = req.params;

    const db = getDb();
    const dashboards = db.dashboards;

    const found = dashboards.some((d) => d.id === dashboardId);
    if (!found) {
      return res.status(404).send("Dashboard not found");
    }

    const updatedDashboards = dashboards.filter((d) => d.id !== dashboardId);

    server.db.setState({
      ...db,
      dashboards: updatedDashboards,
    });

    res.status(204).send();
  });

  return router;
};
