// UpdateProfileModal.jsx
import { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/modal";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";

function UpdateProfileModal({ isOpen, onClose, user, updateUser }) {

    const [formData, setFormData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
    });
    const [image, setImage] = useState(null);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const selectedImages = Array.from(e.target.files);
        setImage(selectedImages);
    };

    const handleSubmit = async () => {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${user.token}`,
            },
        };

        const updatedFormData = { ...formData, firstName: formData.firstName.trim(), lastName: formData.lastName.trim() };

        const updatedUser = {
            ...user,
            firstName: updatedFormData.firstName,
            lastName: updatedFormData.lastName,
        };

        const updatedFormDataWithImages = new FormData();
        updatedFormDataWithImages.append("firstName", updatedFormData.firstName);
        updatedFormDataWithImages.append("lastName", updatedFormData.lastName);
        if (image && image.length > 0) {
            image.forEach((img) => {
                updatedFormDataWithImages.append("image", img);
            });
        }

        try {
            const response = await axios.put(
                `http://localhost:3000/profile/${user._id}`,
                updatedFormDataWithImages,
                config
            );
            console.log(response.data);
            updateUser(updatedUser); // Update the user data in the frontend
        } catch (error) {
            console.error(error);
        }
    };





    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Profile</ModalHeader>
                <ModalBody>
                    <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First Name"
                    />

                    <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                    />
                    <Input type="file" onChange={handleImageChange} accept="image/*" />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSubmit}>
                        Update
                    </Button>
                    <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default UpdateProfileModal;
