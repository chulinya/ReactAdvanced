"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  useToast,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";

export const EventPage = () => {
  const { eventId } = useParams(); // Get event ID from URL
  const navigate = useNavigate(); // For redirecting
  const toast = useToast(); // For showing toast messages
  const [event, setEvent] = useState(null);
  const [creator, setCreator] = useState(null); // To store creator details
  const [isEditing, setIsEditing] = useState(false); // To manage modal state
  const [formData, setFormData] = useState({}); // For editing form data

  // Fetch event and creator details
  useEffect(() => {
    fetch(`http://localhost:3000/events/${eventId}`)
      .then((res) => res.json())
      .then((data) => {
        setEvent(data);
        setFormData(data); // Initialize formData for editing
        if (data.createdBy) {
          return fetch(`http://localhost:3000/users/${data.createdBy}`);
        }
        throw new Error("Creator ID not found");
      })
      .then((res) => res.json())
      .then((user) => setCreator(user))
      .catch((err) => {
        console.error("Error fetching event or creator details:", err);
        toast({
          description: "Failed to load event or creator details.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [eventId, toast]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            toast({
              description: "Event deleted successfully.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            navigate("/"); // Redirect to events page
          } else {
            throw new Error("Failed to delete event");
          }
        })
        .catch((err) => {
          console.error("Error deleting event:", err);
          toast({
            description: "Failed to delete the event. Please try again.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  const handleEdit = () => {
    fetch(`http://localhost:3000/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          toast({
            description: "Event updated successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setIsEditing(false); // Close the modal
          return res.json();
        } else {
          throw new Error("Failed to update event");
        }
      })
      .then((updatedEvent) => setEvent(updatedEvent))
      .catch((err) => {
        console.error("Error updating event:", err);
        toast({
          description: "Failed to update event. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!event) return <Text>Loading event...</Text>;
  if (!creator) return <Text>Loading creator details...</Text>;

  return (
    <Box p="4">
      <Image src={event.image} alt={event.title} mb="4" />
      <Heading>{event.title}</Heading>
      <Text>{event.description}</Text>
      <Text mt="4">
        Start Time: {new Date(event.startTime).toLocaleString()} | End Time:{" "}
        {new Date(event.endTime).toLocaleString()}
      </Text>
      <Text mt="2">Location: {event.location}</Text>

      {/* Creator Details */}
      <Flex mt="4" alignItems="center">
        <Image
          src={creator.image}
          alt={creator.name}
          borderRadius="full"
          boxSize="50px"
          mr="4"
        />
        <Text fontWeight="bold">{creator.name}</Text>
      </Flex>

      {/* Edit and Delete Buttons */}
      <Flex mt="4">
        <Button
          colorScheme="blue"
          mr="4"
          onClick={() => setIsEditing(true)} // Open modal
        >
          Edit Event
        </Button>
        <Button colorScheme="red" onClick={handleDelete}>
          Delete Event
        </Button>
      </Flex>

      {/* Edit Modal */}
      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="4">
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Image URL</FormLabel>
              <Input
                name="image"
                value={formData.image}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Start Time</FormLabel>
              <Input
                name="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>End Time</FormLabel>
              <Input
                name="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEdit}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
