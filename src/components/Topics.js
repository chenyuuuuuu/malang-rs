import React, { useState, useEffect } from 'react';
import { firestore } from '../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function Topics({ linkPrefix }) {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(firestore, 'topics'));
                const topicsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTopics(topicsData);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <List animated selection>
            {topics.map((topic) => (
                <List.Item key={topic.id} as={Link} to={`/${linkPrefix}/${topic.name}`}>
                    {topic.name}
                </List.Item>
            ))}
        </List>
    );
}

export default Topics;
