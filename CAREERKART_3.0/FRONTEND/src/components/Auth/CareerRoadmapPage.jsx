import React, { useEffect, useState } from 'react';
import RoadmapChart from '../components/RoadmapChart';
import axios from 'axios';

const CareerRoadmapPage = () => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    // Example fetch from backend
    axios.get('/api/student/roadmap') // adjust as per your backend
      .then(res => {
        const roadmapString = res.data.roadmap; // e.g., "10th -> 12th -> BSc -> MSc -> Data Scientist"
        const roadmapArray = roadmapString.split('->').map(s => s.trim());
        setSteps(roadmapArray);
      });
  }, []);

  return (
    <div>
      <h2>Career Roadmap</h2>
      <RoadmapChart roadmapSteps={steps} />
    </div>
  );
};

export default CareerRoadmapPage;
