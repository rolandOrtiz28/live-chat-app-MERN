import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import SideDrawer from "../misc/SideDrawer";
import { ChatState } from "../../Context/ChatProvider";
import MyChats from "./MyChats";
import Chatbox from "./ChatBox";

const Chats = () => {
    const [fetchAgain, setFetchAgain] = useState(false);
    const { user } = ChatState();

    return (
        <div style={{ width: "100%" }}>

            {user && <SideDrawer />}
            <Box style={{ flex: 1, display: "flex", flexDirection: "row" }}>
                {user && <MyChats fetchAgain={fetchAgain} flex="1" />}
                {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} flex="1" />}
            </Box>
        </div>
    );
};

export default Chats;