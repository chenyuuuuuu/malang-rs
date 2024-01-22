import React, { useState, useEffect } from 'react';
import { Container, Header, Form, Button, Image, Dropdown } from "semantic-ui-react";
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { firestore, storage } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';

function NewAttraction() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [rating] = useState(0);
    const [reviewsCount] = useState(0);
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        getDocs(collection(firestore, 'topics')).then((querySnapshot) => {
            const loadedTopics = querySnapshot.docs.map(doc => ({
                key: doc.id,
                text: doc.data().name,
                value: doc.data().name,
            }));
            setTopics(loadedTopics);
        });
    }, []);

    const previewUrl = file ? URL.createObjectURL(file) : 'https://react.semantic-ui.com/images/wireframe/image.png';

    function onSubmit() {
        setIsLoading(true);
        const attractionRef = doc(collection(firestore, 'attractions'));
        const fileRef = ref(storage, 'attraction-images/' + attractionRef.id);

        uploadBytes(fileRef, file).then(() => {
            getDownloadURL(fileRef).then((imageUrl) => {
                setDoc(attractionRef, {
                    name,
                    description,
                    address,
                    additionalInfo,
                    rating,
                    reviewsCount,
                    topics: selectedTopics,
                    imageUrl,
                }).then(() => {
                    setIsLoading(false);
                    navigate('/attractions');
                });
            });
        });
    }

    return (
        <Container>
            <Header>Create a New Attraction</Header>
            <Form onSubmit={onSubmit}>
                <Image src={previewUrl} size="small" floated="left" />
                <Button basic as="label" htmlFor="attraction-image">
                    Upload Photo
                </Button>
                <Form.Input
                    type="file"
                    id="attraction-image"
                    style={{ display: 'none' }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <Form.Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Form.TextArea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <Form.Input
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <Form.Input
                    placeholder="Additional Information"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                />
                <Dropdown
                    placeholder="Select Topics"
                    fluid
                    multiple
                    selection
                    options={topics}
                    value={selectedTopics}
                    onChange={(e, { value }) => setSelectedTopics(value)}
                />
                <Form.Button loading={isLoading}>Publish</Form.Button>
            </Form>
        </Container>
    );
}

export default NewAttraction;
