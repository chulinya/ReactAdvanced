import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root"; // Root layout component
import { EventsPage } from "./pages/EventsPage"; // Events listing page
import { EventPage } from "./pages/EventPage"; // Event details page
import { EventForm } from "./pages/EventForm"; // Event form for adding/editing events

// Define the routes using React Router
const router = createBrowserRouter([
  {
    path: "/", // Base route
    element: <Root />, // Main layout component
    children: [
      { path: "/", element: <EventsPage /> }, // Events listing route
      { path: "/event/:eventId", element: <EventPage /> }, // Event details route
      { path: "/add-event", element: <EventForm /> }, // Add event form route
      { path: "/edit-event/:eventId", element: <EventForm /> }, // Edit event form route
    ],
  },
]);

// Render the application to the DOM
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} /> {/* React Router configuration */}
    </ChakraProvider>
  </React.StrictMode>
);
