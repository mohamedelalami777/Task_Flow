import { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import api from '../../api/axios';

export default function LoginBS() {
 const dispatch = useDispatch();
 const { loading, error } = useSelector((state: RootState) => state.auth);
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  dispatch(loginStart());
  try {
   const { data: users } = await api.get(`/users?email=${email}`);
   if (users.length === 0 || users[0].password !== password) {
    dispatch(loginFailure('Email ou mot de passe incorrect'));
    return;
   }
   const { password: _, ...user } = users[0]; // eslint-disable-line @typescript-eslint/no-unused-vars
 const fakeToken = btoa(JSON.stringify({
  userId: user.id,
  email: user.email,
  role: 'admin',
  exp: Date.now() + 3600000 // expire dans 1h
 }));
 dispatch(loginSuccess({ user, token: fakeToken }));
  } catch {
   dispatch(loginFailure('Erreur serveur'));
  }
 }

 return (
  <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh', backgroundColor: '#f0f0f0' }}>
   <Card style={{ maxWidth: 400, width: '100%' }}>
    <Card.Body>
     <Card.Title className="text-center" style={{ color: '#1B8C3E' }}>TaskFlow</Card.Title>
     <p className="text-center text-muted">Connectez-vous pour continuer</p>
     {error && <Alert variant="danger">{error}</Alert>}
     <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
       <Form.Control type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
      </Form.Group>
      <Form.Group className="mb-3">
       <Form.Control type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required />
      </Form.Group>
      <Button type="submit" variant="success" className="w-100" disabled={loading}>
       {loading ? 'Connexion...' : 'Se connecter'}
      </Button>
     </Form>
    </Card.Body>
   </Card>
  </Container>
 );
}