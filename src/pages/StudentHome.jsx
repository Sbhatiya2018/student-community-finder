import React, { useState, useEffect } from 'react';
import StudentForm from '../components/StudentForm';
import CommunityList from '../components/CommunityList';
import '../index.css';

function StudentHome() {
    const [communities, setCommunities] = useState([]);
    const [filteredCommunities, setFilteredCommunities] = useState(null);

    useEffect(() => {
        fetch('/api/communities')
            .then(res => res.json())
            .then(data => {
                if (data && Array.isArray(data.data)) {
                    setCommunities(data.data);
                } else {
                    console.error("Invalid data format:", data);
                    setCommunities([]);
                }
            })
            .catch(err => {
                console.error("Failed to fetch communities", err);
                setCommunities([]);
            });
    }, []);

    const handleSearch = (criteria) => {
        // Simple matching logic
        const results = communities.filter(comm => {
            let matches = false;

            // If country is global, it always matches if selected country is empty or just generic
            if (comm.tags.country === 'Global') return true;

            // Exact country match
            if (criteria.country && comm.tags.country === criteria.country) {
                matches = true;
            }

            // Filter down if course type is specified and doesn't match
            if (matches && criteria.courseType && comm.tags.courseType) {
                if (comm.tags.courseType !== criteria.courseType) matches = false;
            }

            // Filter by specialization (partial match, case insensitive)
            if (matches && criteria.specialization && comm.tags.field) {
                const searchSpec = criteria.specialization.toLowerCase();
                const commField = comm.tags.field.toLowerCase();
                if (!commField.includes(searchSpec)) matches = false;
            }

            // If no criteria provided, show nothing or all? Let's show all if empty
            if (!criteria.country && !criteria.courseType) return false;

            return matches;
        });

        // If no results, maybe return Global ones
        const finalResults = results.length > 0 ? results : communities.filter(c => c.tags.country === 'Global');

        setFilteredCommunities(finalResults);
    };

    return (
        <div className="App">
            <h1>Student Community Finder</h1>

            <div className="container">
                <StudentForm onSearch={handleSearch} />
                {filteredCommunities && <CommunityList communities={filteredCommunities} />}
            </div>

            {!filteredCommunities && (
                <p style={{ marginTop: '4rem', color: 'var(--text-muted)', opacity: 0.6 }}>
                    Start by selecting your destination country.
                </p>
            )}

            <footer style={{ marginTop: '2rem', textAlign: 'center', opacity: 0.5 }}>
                <a href="/admin" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.8rem' }}>Admin Access</a>
            </footer>
        </div>
    );
}

export default StudentHome;
