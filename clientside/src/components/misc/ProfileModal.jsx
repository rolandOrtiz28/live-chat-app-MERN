
import { useState } from "react";
import { ViewIcon } from "@chakra-ui/icons";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    IconButton,
    Text,
    Image,
} from "@chakra-ui/react";
import UpdateProfileModal from "./UpdateProfileModal";



const ProfileModal = ({ user, children, showUpdateButton }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);

    const openUpdateProfileModal = () => {
        setUpdateModalOpen(true);
    };

    const closeUpdateProfileModal = () => {
        setUpdateModalOpen(false);
    };

    const updateUser = (updatedUser) => {
        // Update the user data in the frontend
        // You can update the state or perform any necessary actions here
        console.log(updatedUser);
    };

    const latestProfileImageUrl = user.pic.length > 0 ? user.pic[user.pic.length - 1].url : "/images/Avatar.png";

    return (
        <>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
            )}
            <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize="40px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} {user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={latestProfileImageUrl}
                            alt={user.firstName}
                        />
                        <Text
                            fontSize={{ base: "15px", md: "20px" }}
                            fontFamily="Work sans"
                        >
                            Email: {user.email}
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                        {showUpdateButton && (
                            <Button onClick={openUpdateProfileModal}>Update</Button>
                        )}
                        <UpdateProfileModal
                            isOpen={isUpdateModalOpen}
                            onClose={closeUpdateProfileModal}
                            user={user}
                            updateUser={updateUser} // Pass the updateUser function as a prop
                        />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ProfileModal;
