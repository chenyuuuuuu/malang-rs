import React, { useState } from 'react';
import { Menu, Container, Grid, Segment, Dropdown, Table } from 'semantic-ui-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Mock-up data for attractions
const attractionsData = [
    { name: 'Bromo Tengger Semeru National Park', yearMonth: '2023-11', views: 400, recommendations: 250 },
    { name: 'Bromo Tengger Semeru National Park', yearMonth: '2023-12', views: 450, recommendations: 300 },
    { name: 'Bromo Tengger Semeru National Park', yearMonth: '2024-01', views: 420, recommendations: 270 },
    { name: 'Mount Semeru Volcano', yearMonth: '2023-11', views: 350, recommendations: 200 },
    { name: 'Mount Semeru Volcano', yearMonth: '2023-12', views: 300, recommendations: 150 },
    { name: 'Mount Semeru Volcano', yearMonth: '2024-01', views: 320, recommendations: 170 },
    { name: 'Malang City Square', yearMonth: '2023-11', views: 450, recommendations: 300 },
    { name: 'Malang City Square', yearMonth: '2023-12', views: 480, recommendations: 330 },
    { name: 'Malang City Square', yearMonth: '2024-01', views: 500, recommendations: 350 },
    { name: 'Sempu Island', yearMonth: '2023-11', views: 300, recommendations: 150 },
    { name: 'Sempu Island', yearMonth: '2023-12', views: 320, recommendations: 180 },
    { name: 'Sempu Island', yearMonth: '2024-01', views: 310, recommendations: 160 },
];


const attractionOptions = [
    { key: 'all', text: 'All Attractions', value: 'all' },
    { key: 'Bromo Tengger Semeru National Park', text: 'Bromo Tengger Semeru National Park', value: 'Bromo Tengger Semeru National Park' },
    { key: 'Mount Semeru Volcano', text: 'Mount Semeru Volcano', value: 'Mount Semeru Volcano' },
    { key: 'Malang City Square', text: 'Malang City Square', value: 'Malang City Square' },
    { key: 'Sempu Island', text: 'Sempu Island', value: 'Sempu Island' },
];

const yearMonthOptions = [
    { key: 'all', text: 'All Months', value: 'all' },
    { key: '2023-11', text: 'Nov 2023', value: '2023-11' },
    { key: '2023-12', text: 'Dec 2023', value: '2023-12' },
    { key: '2024-01', text: 'Jan 2024', value: '2024-01' },
];
function Government() {
    const [selectedAttraction, setSelectedAttraction] = useState('all');
    const [selectedYearMonth, setSelectedYearMonth] = useState('all');

    const filteredData = attractionsData.filter(attraction => {
        return (selectedAttraction === 'all' || attraction.name === selectedAttraction) &&
            (selectedYearMonth === 'all' || attraction.yearMonth === selectedYearMonth);
    });

    const handleAttractionChange = (e, { value }) => setSelectedAttraction(value);
    const handleYearMonthChange = (e, { value }) => setSelectedYearMonth(value);

    return (
        <>
            <Menu>
                <Menu.Item header>Admin Dashboard</Menu.Item>
                <Menu.Item>
                    <Dropdown
                        placeholder='Select Attraction'
                        fluid
                        selection
                        options={attractionOptions}
                        value={selectedAttraction}
                        onChange={handleAttractionChange}
                    />
                </Menu.Item>
                <Menu.Item>
                    <Dropdown
                        placeholder='Select Year-Month'
                        fluid
                        selection
                        options={yearMonthOptions}
                        value={selectedYearMonth}
                        onChange={handleYearMonthChange}
                    />
                </Menu.Item>
            </Menu>
            <Container style={{ marginTop: '2em' }}>
                <Grid columns={2} stackable>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Table celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Attraction</Table.HeaderCell>
                                        <Table.HeaderCell>Year-Month</Table.HeaderCell>
                                        <Table.HeaderCell>Views</Table.HeaderCell>
                                        <Table.HeaderCell>Recommendations</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {filteredData.map((data, index) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>{data.name}</Table.Cell>
                                            <Table.Cell>{data.yearMonth}</Table.Cell>
                                            <Table.Cell>{data.views}</Table.Cell>
                                            <Table.Cell>{data.recommendations}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment>
                                <h3>Attraction Views and Recommendations</h3>
                                <BarChart width={600} height={300} data={filteredData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey={selectedAttraction === 'all' ? "name" : "yearMonth"} />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="views" fill="#8884d8" name="Views" />
                                    <Bar dataKey="recommendations" fill="#82ca9d" name="Recommendations" />
                                </BarChart>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        </>
    );
}

export default Government;
