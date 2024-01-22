
import React, { useState } from 'react';
import { Menu, Form, Container } from 'semantic-ui-react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';

function Signin() {
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Handle form submission
    function onSubmit(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Perform actions based on the current active menu item
        if (activeItem === 'register') {
            createUserWithEmailAndPassword(auth, email, password)
                .then(() => {
                    navigate("/"); // Navigate to the home page
                })
                .catch((error) => {
                    setError(error.message); // Handle errors here
                });
        } else if (activeItem === 'signin') {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    navigate("/"); // Navigate to the home page
                })
                .catch((error) => {
                    setError(error.message); // Handle errors here
                });
        }
    };

    return (
        <Container>
            {/* Navigation menu to allow users to switch between sign up and sign in */}
            <Menu widths={2}>
                <Menu.Item
                    name="register"
                    active={activeItem === 'register'}
                    onClick={() => setActiveItem('register')}>
                    Sign Up
                </Menu.Item>
                <Menu.Item
                    name="signin"
                    active={activeItem === 'signin'}
                    onClick={() => setActiveItem('signin')}>
                    Sign In
                </Menu.Item>
            </Menu>

            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

            {/* Form for users to enter their email and password */}
            <Form onSubmit={onSubmit}>
                <Form.Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                />
                <Form.Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <Form.Button type="submit">
                    {activeItem === 'register' ? 'Sign Up' : 'Sign In'}
                </Form.Button>
            </Form>
        </Container>
    );
}

export default Signin;