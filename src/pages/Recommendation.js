import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../utils/firebase';
import { useParams } from 'react-router-dom';
import { Container, Form, Radio, Button, Divider, Card, Image } from 'semantic-ui-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Header from "../Header";


function Recommendation() {
    const [selectedOption, setSelectedOption] = useState('');
    const [attractions, setAttractions] = useState([]);
    const { topicName } = useParams();

    const handleOptionChange = (e, { value }) => setSelectedOption(value);

    const handleSubmit = async () => {
        let attractionsQuery = collection(firestore, 'attractions');

        if (selectedOption) {
            attractionsQuery = query(attractionsQuery, where('category', '==', selectedOption));
        }

        const querySnapshot = await getDocs(attractionsQuery);
        const fetchedAttractions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setAttractions(fetchedAttractions);
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
                <Form onSubmit={handleSubmit}>
                    <Form.Field>
                        <label>What made you choose to visit Malang?</label>
                        <Radio
                            label='Nature'
                            name='recommendationGroup'
                            value='nature'
                            checked={selectedOption === 'nature'}
                            onChange={handleOptionChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Attractions Spot'
                            name='recommendationGroup'
                            value='landmarks'
                            checked={selectedOption === 'landmarks'}
                            onChange={handleOptionChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Radio
                            label='Cultural heritage'
                            name='recommendationGroup'
                            value='cultural'
                            checked={selectedOption === 'cultural'}
                            onChange={handleOptionChange}
                        />
                    </Form.Field>
                    <Button type='submit'>Submit</Button>
                </Form>
                <Divider />
                <Card.Group>
                    {attractions.map(attraction => (
                        <Card key={attraction.id}>
                            <Image src={attraction.imageUrl} wrapped ui={false} />
                            <Card.Content>
                                <Card.Header>{attraction.name}</Card.Header>
                                <Card.Description>
                                    {attraction.description}
                                </Card.Description>
                            </Card.Content>
                        </Card>
                    ))}
                </Card.Group>
            </Container>
        </>
    );
}

export default Recommendation;
