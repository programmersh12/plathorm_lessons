import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { certificateAPI } from '../services/api';
import { Link } from 'react-router-dom';

const Certificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [dipl