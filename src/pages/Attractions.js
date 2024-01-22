import React, { useState, useEffect } from 'react';
import { Grid, Item, Container, Rating, Icon, Button } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import Topics from '../components/Topics';
import Header from "../Header";
import { firestore, auth } from '../utils/firebase';
import { collection, query, where, getDocs, getDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

function Attractions() {
    const [attractions, setAttractions] = useState([]);
    const { topicName } = useParams();

    const handleFavorite = async (postId) => {
        const currentUserId = auth.currentUser ? auth.currentUser.uid : null;
        if (!currentUserId) {
            console.log("User is not logged in.");
            return;
        }

        const attractionRef = doc(firestore, 'attractions', postId);
        try {
            const attractionSnapshot = await getDoc(attractionRef);
            if (attractionSnapshot.exists()) {
                const attractionData = attractionSnapshot.data();
                const isFavorited = attractionData.favorites?.includes(currentUserId);

                // 更新 Firestore 文檔
                await updateDoc(attractionRef, {
                    favorites: isFavorited
                        ? arrayRemove(currentUserId) // 正確移除 currentUserId
                        : arrayUnion(currentUserId) // 正確添加 currentUserId
                });

                // 更新本地狀態以反映收藏狀態的變更
                setAttractions(attractions.map(attraction => {
                    if (attraction.id === postId) {
                        return {
                            ...attraction,
                            isFavorited: !isFavorited // 切換收藏狀態
                        };
                    }
                    return attraction;
                }));
            } else {
                console.log("Attraction does not exist.");
            }
        } catch (error) {
            console.error("Error updating favorites: ", error);
        }
    };

    useEffect(() => {
        let attractionsQuery = collection(firestore, 'attractions');

        if (topicName) {
            attractionsQuery = query(attractionsQuery, where('topics', 'array-contains', topicName));
        }

        getDocs(attractionsQuery)
            .then((collectionSnapshot) => {
                const attractionsData = collectionSnapshot.docs.map(docSnapshot => {
                    const attractionData = docSnapshot.data();
                    const isFavorited = attractionData.favorites?.includes(auth.currentUser?.uid);
                    return { id: docSnapshot.id, ...attractionData, isFavorited };
                });
                setAttractions(attractionsData);
            });
    }, [topicName]);

    return (
        <>
            <Header />
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Topics linkPrefix="attractions" />
                        </Grid.Column>
                        <Grid.Column width={13}>
                            <Item.Group>
                                {attractions.map((attraction) => (
                                    <Item key={attraction.id}>
                                        <Item.Image src={attraction.imageUrl} />
                                        <Item.Content>
                                            <Item.Header>{attraction.name}</Item.Header>
                                            <Item.Meta>
                                                {attraction.topics ? attraction.topics.join(", ") : "No topics"}
                                            </Item.Meta>
                                            <Item.Description>{attraction.description}</Item.Description>
                                            <Item.Extra>
                                                <Button
                                                    icon={attraction.isFavorited ? 'heart' : 'heart outline'}
                                                    onClick={() => handleFavorite(attraction.id)}
                                                />
                                                <Rating icon='star' defaultRating={attraction.rating} maxRating={5} disabled />
                                                <span className="right floated">
                                                    <Icon name='comment' /> {attraction.reviewsCount} Reviews
                                                </span>
                                                {attraction.additionalInfo && <div>Additional Info: {attraction.additionalInfo}</div>}
                                            </Item.Extra>
                                        </Item.Content>
                                    </Item>
                                ))}
                            </Item.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </>
    );
}

export default Attractions;
