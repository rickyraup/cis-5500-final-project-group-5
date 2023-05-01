import { useEffect, useState } from 'react';
import { Card, Container } from '@mui/material';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function MainPage() {
  return (
    <Container>
      <h1>Hello! Welcome to Data Tune!</h1>
      <h2>Use the navigation bar above to explore different Spotify datasets.</h2>
    </Container>
  )
}