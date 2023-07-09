import { Box } from "@chakra-ui/layout";
import './style.css'
import SingleChat from "./SingleChat";
import { ChatState } from "../../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            h='90vh'
            mt='1rem'
            ms='1rem'
            borderRadius="10px 0 0 10px"
            borderWidth="1px"
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default Chatbox;