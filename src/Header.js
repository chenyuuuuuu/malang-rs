import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from "semantic-ui-react";
import { auth } from './utils/firebase';

function Header() {
    const [user, setUser] = React.useState(null);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(
            (currentUser) => {
                console.log("User state changed:", currentUser);
                setUser(currentUser);
            },
            (error) => {
                console.error("Firebase auth error:", error);
                setError(error);
            }
        );

        return () => unsubscribe();
    }, []);

    if (error) {
        return <div>Error loading user data: {error.message}</div>;
    }

    return (
        <Menu>
            <Menu.Item as={Link} to="/">
                Malang Platform
            </Menu.Item>
            <Menu.Menu position="right">
                {user ? (
                    <>
                        <Menu.Item as={Link} to="/recommendation">
                            Recommendation
                        </Menu.Item>
                        <Menu.Item as={Link} to="/community">
                            Community
                        </Menu.Item>
                        <Menu.Item as={Link} to="/attractions">
                            Attractions
                        </Menu.Item>
                        <Menu.Item as={Link} to="/mypage">
                            My Favorites
                        </Menu.Item>
                        <Menu.Item onClick={() => {
                            console.log("Logging out...");
                            auth.signOut();
                        }}>
                            Log out
                        </Menu.Item>
                    </>
                ) : (
                    <Menu.Item as={Link} to="/signin">
                        Sign Up / Log in
                    </Menu.Item>
                )}
            </Menu.Menu>
        </Menu>
    );
}

export default Header;
