import { useState } from "react";
import axios from "axios";
import { Box, Button, Text, useColorModeValue } from "@interchain-ui/react";

const ChatPage = () => {
  const [messages, setMessages] = useState<any[]>([]); // Store chat messages
  const [input, setInput] = useState(""); // Store the input message
  const [loading, setLoading] = useState(false); // Loading state for chat interaction

  const sendMessage = async () => {
    if (input.trim() === "") return;

    // Add user's message to the chat
    const newMessage = { role: "human", content: input };
    setMessages([...messages, newMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send the message to the backend API
      const response = await axios.post("/api/chat", { message: input });

      // Check if the AI's response is undefined
      if (!response.data || !response.data.content) {
        console.error("AI Response is undefined");
        const errorMessage = {
          role: "system",
          content: "An error occurred. Please try again later.",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        return;
      }

      // Clean up the AI's response by removing <think> tags
      const cleanedContent = response.data.content.replace(
        /<think>|<\/think>/g,
        ""
      );

      // Add the cleaned AI's response to the chat
      const botMessage = { role: "assistant", content: cleanedContent };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.error("Error sending message to backend:", error);

      // Handle error and add error message to chat
      const errorMessage = {
        role: "system",
        content:
          error.response?.data?.error ||
          "An error occurred. Please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      maxWidth="$containerLg"
      mx="auto"
      px={{ mobile: "$4", tablet: "$8" }}
      py={{ mobile: "$8", tablet: "$12" }}
    >
      <Text
        as="h1"
        fontSize={{ mobile: "$4xl", tablet: "$5xl" }}
        fontWeight="$bold"
        textAlign="center"
      >
        Chat with Delegated Staking Assistant
      </Text>

      <Box
        border="1px solid"
        borderColor={useColorModeValue("#ccc", "#444")}
        padding="$4"
        height="400px"
        overflowY="scroll"
        mb="$4"
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            mb="$2"
            textAlign={msg.role === "human" ? "right" : "left"}
          >
            <Text fontWeight="$bold">
              {msg.role === "human" ? "You" : "Assistant"}:
            </Text>
            <Text>{msg.content}</Text>
          </Box>
        ))}
      </Box>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        rows={4}
        style={{ width: "100%", marginBottom: "16px" }}
      />
      <Button
        onClick={sendMessage}
        disabled={loading}
        attributes={{ width: "100%" }}
      >
        {loading ? "Sending..." : "Send"}
      </Button>
    </Box>
  );
};

export default ChatPage;
