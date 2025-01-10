import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Text,
  Button,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch events and categories when the component loads
  useEffect(() => {
    fetch("http://localhost:3000/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching events:", err));

    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Filter events based on search query and selected category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory ||
      event.categoryIds.includes(parseInt(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <Box p="4">
      <Heading mb="4">Events</Heading>

      {/* Search Input */}
      <Input
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        mb="4"
      />

      {/* Filter by Category */}
      <Select
        placeholder="Filter by category"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        mb="4"
      >
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>

      {/* Display Filtered Events */}
      <SimpleGrid columns={[1, 2, 3]} spacing="4">
        {filteredEvents.map((event) => (
          <Box
            key={event.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p="4"
          >
            <Heading size="md" mb="2">
              {event.title}
            </Heading>
            <Text>{event.description}</Text>
            <Button
              as={Link}
              to={`/event/${event.id}`}
              mt="4"
              colorScheme="blue"
            >
              View Details
            </Button>
          </Box>
        ))}
      </SimpleGrid>

      {/* Show Message if No Events Found */}
      {filteredEvents.length === 0 && (
        <Text mt="4" color="gray.500">
          No events found.
        </Text>
      )}
    </Box>
  );
};
