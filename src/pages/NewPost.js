import React, { useState, useEffect } from 'react';
import { Container, Header, Form, Button, Image, Dropdown } from "semantic-ui-react";
import { collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { firestore, storage, auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';

function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        getDocs(collection(firestore, 'topics'))
            .then((querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => ({
                    key: doc.id,
                    text: doc.data().name,
                    value: doc.data().name,
                }));
                setTopics(data);
            });

        return () => unsubscribe();
    }, []);

    const previewUrl = file
        ? URL.createObjectURL(file)
        : 'https://react.semantic-ui.com/images/wireframe/image.png';

    function onSubmit() {
        setIsLoading(true);
        const documentRef = doc(collection(firestore, 'posts'));
        const fileRef = ref(storage, 'post-images/' + documentRef.id);
        const metadata = {
            contentType: file.type,
        };
        uploadBytes(fileRef, file, metadata).then(() => {
            getDownloadURL(fileRef).then((imageUrl) => {
                setDoc(documentRef, {
                    title,
                    content,
                    topics: selectedTopics,
                    createdAt: Timestamp.now(),
                    author: {
                        displayName: user?.displayName || '',
                        photoURL: user?.photoURL || '',
                        uid: user?.uid,
                        email: user?.email,
                    },
                    imageUrl,
                }).then(() => {
                    setIsLoading(false);
                    navigate('/community');
                });
            });
        });
    }

    return (
        <Container>
            <Header>Create a new post</Header>
            <Form onSubmit={onSubmit}>
                <Image src={previewUrl} size="small" floated="left" />
                <Button basic as="label" htmlFor="post-image">
                    Upload Photo
                </Button>
                <Form.Input
                    type="file"
                    id="post-image"
                    style={{ display: 'none' }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <Form.Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <Form.TextArea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Dropdown
                    placeholder="Topics"
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

export default NewPost;
