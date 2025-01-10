import React from "react";
import { Link } from "react-router-dom";
import { Flex, Button } from "@chakra-ui/react";

export const Navigation = () => {
  return (
    <Flex as="nav" bg="teal.500" p="4" justifyContent="space-around">
      <Button as={Link} to="/" colorScheme="teal" variant="ghost">
        Events
      </Button>
      <Button as={Link} to="/add-event" colorScheme="teal" variant="ghost">
        Add Event
      </Button>
    </Flex>
  );
};
