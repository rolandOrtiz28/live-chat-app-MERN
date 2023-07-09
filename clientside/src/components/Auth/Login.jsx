import { FormControl, FormLabel, Input, Stack, Button, InputGroup, InputRightElement } from '@chakra-ui/react'
import { PhoneIcon, AddIcon, WarningIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import React from 'react'
import { VStack } from '@chakra-ui/layout'
import { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'


const Login = () => {
    const [show, setShow] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false)
    const toast = useToast();

    const history = useHistory();
    const handleClick = () => setShow(!show)

    const submitHandler = async () => {
        setLoading(true);
        if (!username || !password) {
            toast({
                title: 'Please Fill all the Fields',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            setLoading(false);
            return;
        }
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                }
            }
            const url = "http://localhost:3000/login"
            const { data } = await axios.post(url, { username, password },
                config
            );

            if (data.message === 'Login successful') {
                toast({
                    title: 'Login Successful',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
                console.log(data.user)
                localStorage.setItem('userInfo', JSON.stringify(data.user))
                console.log("Redirecting to chat component...");
                setLoading(false);
                window.location.reload();
                history.push('/chats');

            } else {
                toast({
                    title: 'Error Occurred',
                    description: 'Failed to login',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
                setLoading(false);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast({
                    title: 'Error Occurred',
                    description: error.response.data.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
            } else {
                toast({
                    title: 'Error Occurred',
                    description: 'Failed to login',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: "bottom"
                });
            }
            setLoading(false);
        }
    };

    return <VStack spacing="5px" color='black'>
        <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
                value={username}
                placeholder='Username'
                onChange={(e) => setUsername(e.target.value)}
            ></Input>
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                    value={password}
                    type={show ? "text" : "password"}
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
        <Button
            bg='brand.100'
            variant='solid'
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
        >Sign in!</Button>
        <Button
            variant='solid'
            bg='brand.200'
            width="100%"
            style={{ marginTop: 15 }}
            onClick={() => {
                setUsername("Guest123");
                setPassword("Guest1234567");
            }}
        >Sign in as a Guest!</Button>
    </VStack >
}

export default Login
