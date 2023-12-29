// Import necessary React components and styles
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Form, Modal, Navbar, Nav } from 'react-bootstrap';
 

function App() {
  const [courses, setCourses] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({ username: '', password: '' });
  const [isAdminAuthenticated, setAdminAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [editedCourse, setEditedCourse] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [adminPanelActive, setAdminPanelActive] = useState(false); 

  // State for user submissions
  const [submissions, setSubmissions] = useState([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Fetch courses from the API on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  // Function to handle admin login
  const handleAdminLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/user/login', adminCredentials);
      if (response.data.success) {
        setAdminAuthenticated(true);
        setShowLoginModal(false);
        setLoginError('');
        // Set admin panel active
        setAdminPanelActive(true);
      } else {
        setLoginError('Authentication failed. Please check your username and password.');
      }
    } catch (error) {
      console.error(error);
      setLoginError('An error occurred during authentication.');
    }
  };

  // Function to create a new course
  const createCourse = async () => {
    const newCourse = {
      title: 'New Course',
      description: 'This is a new course.',
      image: 'https://example.com/image.jpg',
      price: 99.99,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/courses', newCourse);
      setCourses([...courses, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to edit a course
  const editCourse = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/courses/${editedCourse._id}`, editedCourse);
      const updatedCourses = courses.map(course => (course._id === editedCourse._id ? response.data : course));
      setCourses(updatedCourses);
      setShowEditModal(false);
      setEditedCourse(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to delete a course
  const deleteCourse = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`);
      const updatedCourses = courses.filter(course => course._id !== courseId);
      setCourses(updatedCourses);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to handle user submission
  const handleSubmission = () => {
    const newSubmission = { email, message };
    setSubmissions([...submissions, newSubmission]);
    // Clear the form fields
    setEmail('');
    setMessage('');
  };

  // JSX structure for the landing page
  return (
    <Container className="mt-5">
      <Navbar bg="light" expand="lg" className="mb-4">
        <Navbar.Brand href="#home">
          <img
            src='https://9antra.tn/content/images/LogoBridge.png'// Make sure to put the correct path to your image
            width="60" // Adjust the width as needed
            height="60" // Adjust the height as needed
            className="d-inline-block align-top"
            alt="Bridge Logo"
          />
          E-Learning Platform - The Bridge
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#" onClick={createCourse} disabled={!isAdminAuthenticated}>
              Register
            </Nav.Link>
            <Nav.Link href="#" onClick={() => setShowLoginModal(true)}>
              Espace Admin
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {/* Header */}
      <header className="text-center mb-4">
        <h1>E-Learning Platform - The Bridge</h1>
      </header>

      {/* Buttons */}
      <div className="text-center mb-4">
        <Button variant="success" className="mr-2" onClick={createCourse} disabled={!isAdminAuthenticated}>
          Register
        </Button>
        <Button variant="info" onClick={() => setShowLoginModal(true)}>
          Espace Admin
        </Button>
      </div>

      <Row className="mb-4">
        {courses.map(course => (
          <Col key={course._id} md={4}>
            <Card>
              <Card.Img variant="top" src={course.image} alt={course.title} />
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>{course.description}</Card.Text>
                <Card.Text>Price: ${course.price}</Card.Text>
                {isAdminAuthenticated && (
                  <>
                    <Button variant="info" onClick={() => {
                      setEditedCourse(course);
                      setShowEditModal(true);
                    }}>
                      Edit
                    </Button>
                    <Button variant="danger" className="ml-2" onClick={() => deleteCourse(course._id)}>
                      Delete
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Contact Form Section */}
      <section className="mt-4 text-center">
        <h2>Contact Us</h2>
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formMessage">
            <Form.Label>Message:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="button" onClick={handleSubmission}>
            Submit
          </Button>
        </Form>
      </section>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={adminCredentials.username}
                onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" type="button" onClick={handleAdminLogin}>
              Login
            </Button>
          </Form>
          {loginError && <p className="text-danger mt-2">{loginError}</p>}
        </Modal.Body>
      </Modal>

      {/* Edit Course Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editFormTitle">
              <Form.Label>Title:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={editedCourse ? editedCourse.title : ''}
                onChange={(e) => setEditedCourse({ ...editedCourse, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="editFormDescription">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={editedCourse ? editedCourse.description : ''}
                onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="editFormImage">
              <Form.Label>Image URL:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={editedCourse ? editedCourse.image : ''}
                onChange={(e) => setEditedCourse({ ...editedCourse, image: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="editFormPrice">
              <Form.Label>Price:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={editedCourse ? editedCourse.price : 0}
                onChange={(e) => setEditedCourse({ ...editedCourse, price: parseFloat(e.target.value) })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" type="button" onClick={editCourse}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

// Export the App component
export default App;
