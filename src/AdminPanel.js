import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Form, Container, Row, Col } from 'react-bootstrap';

const AdminPanel = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
  });

  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
  }, [courses]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createCourse = async () => {
    try {
      await axios.post('http://localhost:5000/api/courses', newCourse);
      setNewCourse({
        title: '',
        description: '',
        image: '',
        price: '',
      });
      fetchCourses();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Admin Panel</h2>
      <Row className="mb-4">
        {courses.map(course => (
          <Col key={course._id} md={4}>
            <Card>
              <Card.Img variant="top" src={course.image} alt={course.title} />
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                <Card.Text>Price: ${course.price}</Card.Text>
                <Button variant="danger" onClick={() => deleteCourse(course._id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Form>
        {/* ... your existing form ... */}
        <Button variant="primary" type="button" onClick={createCourse}>
          Create Course
        </Button>
      </Form>
    </Container>
  );
};

export default AdminPanel;
