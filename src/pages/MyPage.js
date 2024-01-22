import React, { useState, useEffect } from 'react';
import { Container, Item, Header as SemanticHeader, Segment, Placeholder } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { firestore, auth } from '../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Header from "../Header";

function MyPage() {
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [favoriteAttractions, setFavoriteAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = auth.currentUser ? auth.currentUser.uid : null;

    useEffect(() => {
        if (currentUserId) {
            setLoading(true);

            const postsQuery = query(collection(firestore, 'posts'), where('favorites', 'array-contains', currentUserId));
            const attractionsQuery = query(collection(firestore, 'attractions'), where('favorites', 'array-contains', currentUserId));

            Promise.all([getDocs(postsQuery), getDocs(attractionsQuery)]).then(([postsSnapshot, attractionsSnapshot]) => {
                setFavoritePosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setFavoriteAttractions(attractionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            });
        }
    }, [currentUserId]);

    return (
        <>
            <Header />
            <Container>
                {loading ? (
                    <Placeholder fluid>
                        <Placeholder.Header image>
                            <Placeholder.Line />
                            <Placeholder.Line />
                        </Placeholder.Header>
                    </Placeholder>
                ) : (
                    <>
                        <Segment>
                            <SemanticHeader as='h3'>Favorite Posts</SemanticHeader>
                            {favoritePosts.length > 0 ? (
                                <Item.Group>
                                    {favoritePosts.map((post) => (
                                        <Item key={post.id} as={Link} to={`/post/${post.id}`}>
                                            <Item.Image size='tiny' src={post.imageUrl || 'default_image_url'} />
                                            <Item.Content>
                                                <Item.Header>{post.title}</Item.Header>
                                                <Item.Description>{post.content}</Item.Description>
                                            </Item.Content>
                                        </Item>
                                    ))}
                                </Item.Group>
                            ) : (
                                <p>No favorite posts yet.</p>
                            )}
                        </Segment>

                        <Segment>
                            <SemanticHeader as='h3'>Favorite Attractions</SemanticHeader>
                            {favoriteAttractions.length > 0 ? (
                                <Item.Group>
                                    {favoriteAttractions.map((attraction) => (
                                        <Item key={attraction.id} as={Link} to={`/attraction/${attraction.id}`}>
                                            <Item.Image size='tiny' src={attraction.imageUrl} />
                                            <Item.Content>
                                                <Item.Header>{attraction.name}</Item.Header>
                                                <Item.Description>{attraction.description}</Item.Description>
                                            </Item.Content>
                                        </Item>
                                    ))}
                                </Item.Group>
                            ) : (
                                <p>No favorite attractions yet.</p>
                            )}
                        </Segment>
                    </>
                )}
            </Container>
        </>
    );
}

export default MyPage;
