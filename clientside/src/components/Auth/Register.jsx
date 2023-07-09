import { FormControl, FormLabel, Input, Stack, Button, InputGroup, InputRightElement } from '@chakra-ui/react'
import { PhoneIcon, AddIcon, WarningIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import React from 'react'
import { VStack } from '@chakra-ui/layout'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'


const Register = () => {
    const [show, setShow] = useState(false)
    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false)
    const toast = useToast();

    const history = useHistory();

    const handleClick = () => setShow(!show)


    const submitHandler = async () => {
        setLoading(true);
        if (!firstName || !lastName || !email || !username || !password) {
            toast({
                title: 'Please Fill all the Fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }

            const url = "http://localhost:3000/register"
            const { data } = await axios.post(url, { firstName, lastName, username, password, email },
                config
            );

            toast({
                title: 'Registration Successful',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });

            localStorage.setItem('userInfo', JSON.stringify(data))
            setLoading(false)
            window.location.reload(false);
            history.push('/chats')
        } catch (error) {
            console.log(error)
            const errorMessage = error.response?.data?.message || 'Error Occur'
            toast({
                title: 'Error Occur',
                description: errorMessage,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
        }

    };

    return <VStack spacing="5px" color='black'>
        <FormControl id="first-name" isRequired>
            <FormLabel>First name</FormLabel>
            <Input
                name='firstName'
                placeholder='First Name'
                onChange={(e) => setFirstName(e.target.value)}
            ></Input>
        </FormControl>
        <FormControl id="last-name" isRequired>
            <FormLabel>Last name</FormLabel>
            <Input
                name='lastName'
                placeholder='Last Name'
                onChange={(e) => setLastName(e.target.value)}
            ></Input>
        </FormControl>
        <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
                type='text'
                name='username'
                placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}
            ></Input>
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
                type='email'
                name='email' // Corrected the misspelled attribute name
                placeholder='Email'
                onChange={(e) => setEmail(e.target.value)}
            ></Input>
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                    type={show ? "text" : "password"}
                    name='password'
                    placeholder='Password'
                    onChange={(e) => setPassword(e.target.value)}
                ></Input>
                <InputRightElement width="4.5rem">
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                        {show ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                </InputRightElement>
            </InputGroup>

        </FormControl>
        {/* <FormControl id='pic'>
            <FormLabel>Upload your picture</FormLabel>
            <Input
                type='file'
                p={1.5}
                accept='image/'
                onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl> */}
        <Button
            bg='brand.900'
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}
        >Sign up!</Button>
    </VStack >
}

export default Register
