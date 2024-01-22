import React from 'react';
import { Button, Image, Grid, Segment, Header as SemanticHeader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Header from "../Header";


function HomePage() {
    return (
        <>
            <Header />
            <Segment style={{ padding: '8em 0em' }} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <SemanticHeader as='h3' style={{ fontSize: '2em' }}>
                                Discover the Malang City
                            </SemanticHeader>
                            <p style={{ fontSize: '1.33em' }}>
                                Explore a city rich in culture and history. From beautiful parks to historic landmarks, Malang offers an unforgettable experience.
                            </p>
                            <SemanticHeader as='h3' style={{ fontSize: '2em' }}>
                                Experience the Local Cuisine
                            </SemanticHeader>
                            <p style={{ fontSize: '1.33em' }}>
                                Malang is home to a variety of culinary delights. Taste the local flavors and enjoy the unique dishes.
                            </p>
                        </Grid.Column>
                        <Grid.Column floated='right' width={6}>
                            <Image bordered rounded size='large' src='https://www.javatravel.net/wp-content/uploads/2021/10/Alun-Alun-Kota-Malang.jpg' />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column textAlign='center'>
                            <Button size='huge' color='orange' as={Link} to="/attractions" >Explore Now</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        </>
    );
}

export default HomePage;
