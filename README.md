# Smart Home API

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

   The API will be available at: [http://localhost:3004](http://localhost:3004)

## Data Customization

- The backend uses **sample data** stored in `*.db.json` files.
- You are free to **modify or replace** this data to suit your testing needs.

## Postman Collection

Import the Postman collection to explore and test API endpoints:

**[Smart Home UI Postman Collection](./smart-home-ui.postman_collection.json)**

## Available API Endpoints

### Authentication

#### `POST /api/user/login`

Log in with user credentials and receive a token.

**Request body:**

```json
{
  "userName": "string",
  "password": "string"
}
```

**Response:**

```json
{
  "token": "string"
}
```

#### `GET /api/user/profile`

Retrieve current user profile.

Requires `Authorization: Bearer <token>` header.

**Response:**

```json
{
  "fullName": "string",
  "initials": "string"
}
```

---

### Dashboards

#### `GET /api/dashboards`

Get list of available dashboards.

Requires `Authorization: Bearer <token>` header.

**Response:**

```json
[
  { "id": "overview", "title": "Overview", "icon": "home" },
  { "id": "electricity", "title": "Electricity", "icon": "bolt" }
]
```

#### `GET /api/dashboards/:dashboardId`

Get tabs and cards for a specific dashboard.

Requires `Authorization: Bearer <token>` header.

**Response:**

```json
{
  "tabs": [
    {
      "id": "overview",
      "title": "Overview",
      "cards": [
        {
          "id": "living-room-mixed",
          "title": "Living Room",
          "layout": "verticalLayout",
          "items": [
            {
              "type": "device",
              "icon": "lightbulb",
              "label": "Lamp",
              "state": true
            },
            {
              "type": "sensor",
              "icon": "thermostat",
              "label": "Temperature",
              "value": { "amount": 23.5, "unit": "°C" }
            }
          ]
        }
      ]
    }
  ]
}
```
