import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Select,
} from "@chakra-ui/react";

export const EventForm = () => {
  const { eventId } = useParams(); // Get event ID for editing
  const navigate = useNavigate(); // For redirecting
  const toast = useToast(); // For showing toast messages
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    location: "",
    createdBy: 1, // Default creator ID (set this to an existing user ID)
    categoryIds: [], // Default categories
  });
  const [categories, setCategories] = useState([]);

  // Fetch categories for the dropdown
  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));

    // Fetch event data if editing
    if (eventId) {
      fetch(`http://localhost:3000/events/${eventId}`)
        .then((res) => res.json())
        .then((data) => setFormData(data))
        .catch((err) => {
          console.error("Error fetching event for editing:", err);
          toast({
            description: "Failed to load event details.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  }, [eventId, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const selectedCategories = Array.from(e.target.selectedOptions, (option) =>
      parseInt(option.value)
    );
    setFormData((prev) => ({ ...prev, categoryIds: selectedCategories }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = eventId ? "PUT" : "POST";
    const url = eventId
      ? `http://localhost:3000/events/${eventId}`
      : `http://localhost:3000/events`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          toast({
            description: `Event ${eventId ? "updated" : "added"} successfully.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("/"); // Redirect to events page
        } else {
          throw new Error("Failed to save event");
        }
      })
      .catch((err) => {
        console.error("Error saving event:", err);
        toast({
          description: "Failed to save event. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box p="4">
      <form onSubmit={handleSubmit}>
        <FormControl mb="4">
          <FormLabel>Title</FormLabel>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Description</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Image URL</FormLabel>
          <Input name="image" value={formData.image} onChange={handleChange} />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Start Time</FormLabel>
          <Input
            name="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>End Time</FormLabel>
          <Input
            name="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Location</FormLabel>
          <Input
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb="4">
          <FormLabel>Categories</FormLabel>
          <Select
            name="categoryIds"
            multiple
            value={formData.categoryIds}
            onChange={handleCategoryChange}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" colorScheme="teal">
          {eventId ? "Update Event" : "Add Event"}
        </Button>
      </form>
    </Box>
  );
};
