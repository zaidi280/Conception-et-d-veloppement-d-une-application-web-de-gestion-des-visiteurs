import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
        <Row>
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading...</p>
          </Col>
        </Row>
      </Container>
    );
  }

  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
