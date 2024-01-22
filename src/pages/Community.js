import React, { useState, useEffect } from 'react';
import { Grid, Item, Button, Image, Icon, Container } from 'semantic-ui-react';
import { Link, useParams } from 'react-router-dom';
import Header from "../Header";
import Topics from '../components/Topics';
import { firestore, auth } from '../utils/firebase';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function Community() {
    const [posts, setPosts] = useState([]);
    const { topicName } = useParams();

    const handleFavorite = async (postId) => {
        const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
        if (!currentUserId) {
            console.log("User is not logged in.");
            return;
        }

        const postRef = doc(firestore, 'posts', postId);
        try {
            const postSnapshot = await getDoc(postRef);
            if (postSnapshot.exists()) {
                const postData = postSnapshot.data();
                // Ensure favorites is an array
                const favorites = postData.favorites ? postData.favorites : [];

                const updatedFavorites = favorites.includes(currentUserId)
                    ? arrayRemove(postRef, 'favorites', currentUserId) // Correctly remove the currentUserId
                    : arrayUnion(postRef, 'favorites', currentUserId); // Correctly add the currentUserId

                await updateDoc(postRef, {
                    favorites: updatedFavorites
                });

                // Update the local state to reflect the new favorite status
                setPosts(posts.map(post => {
                    if (post.id === postId) {
                        return {
                            ...post,
                            isFavorited: !post.isFavorited // Toggle favorite status
                        };
                    }
                    return post;
                }));
            } else {
                console.log("Post does not exist.");
            }
        } catch (error) {
            console.error("Error updating favorites: ", error);
        }
    };

    useEffect(() => {
        const postsQuery = topicName
            ? query(collection(firestore, 'posts'), where('topics', 'array-contains', topicName))
            : collection(firestore, 'posts');

        getDocs(postsQuery)
            .then((collectionSnapshot) => {
                const postsData = collectionSnapshot.docs.map(docSnapshot => {
                    const postData = docSnapshot.data();
                    const isFavorited = postData.favorites?.includes(auth.currentUser?.uid);
                    return { id: docSnapshot.id, ...postData, isFavorited };
                });
                setPosts(postsData);
            });
    }, [topicName]);

    return (
        <>
            <Header />
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Topics linkPrefix="community" />
                        </Grid.Column>
                        <Grid.Column width={10}>
                            <Item.Group>
                                {posts.map((post) => (
                                    <Item key={post.id}>
                                        <Item.Image src={post.imageUrl || 'default_image_url'} />
                                        <Item.Content>
                                            <Item.Meta>
                                                {post.author && post.author.photoURL ? (
                                                    <Image src={post.author.photoURL} avatar />
                                                ) : (
                                                    <Icon name="user circle" size="large" />
                                                )}
                                                {post.topics ? post.topics.join(", ") : "No topics"}
                                            </Item.Meta>
                                            <Item.Header>{post.title}</Item.Header>
                                            <Item.Description>{post.content}</Item.Description>
                                            <Item.Extra>
                                                <Button
                                                    icon={post.isFavorited ? 'star' : 'star outline'}
                                                    onClick={() => handleFavorite(post.id)}
                                                />
                                            </Item.Extra>
                                        </Item.Content>
                                    </Item>
                                ))}
                            </Item.Group>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Link to="/newpost">
                                <Button primary>Create New Post</Button>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </>
    );
}

export default Community;
