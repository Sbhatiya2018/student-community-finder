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

            // Filter by stage if specified
            if (matches && criteria.stage && comm.tags.stage) {
                // If community has a stage, it must match. 
                // However, many legacy communities might lack stage, so we only filter stricter if both have it.
                // Decision: If user selects 'Visa', show 'Visa' AND 'General/Empty' ones? 
                // Ideally exact match for specialized groups.
                if (comm.tags.stage !== criteria.stage) matches = false;
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

    const handleSuggestion = (e) => {
        e.preventDefault();
        const msg = e.target.elements.suggestion.value;
        if (!msg) return;

        fetch('/api/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        })
            .then(() => {
                alert("Thanks! We've noted your request.");
                e.target.reset();
            })
            .catch(console.error);
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

            <div style={{ marginTop: '4rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h3>Can't find what you're looking for?</h3>
                <form onSubmit={handleSuggestion} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <input name="suggestion" placeholder="Tell us what community (University/Stage) you need..." style={{ padding: '0.8rem', width: '70%', borderRadius: '4px', border: 'none' }} required />
                    <button type="submit" style={{ padding: '0.8rem 1.5rem' }}>Request</button>
                </form>
            </div>

            <footer style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.5, paddingBottom: '2rem' }}>
                <a href="/admin" style={{ color: 'inherit', textDecoration: 'none', fontSize: '0.8rem' }}>Admin Access</a>
            </footer>
        </div>
    );
}

export default StudentHome;
