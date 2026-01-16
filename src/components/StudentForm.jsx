import React, { useState } from 'react';

const StudentForm = ({ onSearch }) => {
    const [formData, setFormData] = useState({
        country: '',
        sourceCountry: '',
        courseType: '',
        university: '',
        intake: '',
        specialization: '',
        stage: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(formData);
    };

    return (
        <div className="card fade-in">
            <h2>Find Your Community</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                Enter your details to connect with peers.
            </p>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label htmlFor="sourceCountry">Source Country</label>
                        <input
                            type="text"
                            id="sourceCountry"
                            name="sourceCountry"
                            placeholder="e.g. India, China"
                            value={formData.sourceCountry}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="country">Target Country</label>
                        <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Country</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="Canada">Canada</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="Global">Remote / Global</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="university">University / College</label>
                    <input
                        type="text"
                        id="university"
                        name="university"
                        placeholder="e.g. Stanford, Oxford, Humber College"
                        value={formData.university}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label htmlFor="courseType">Course Level</label>
                        <select
                            id="courseType"
                            name="courseType"
                            value={formData.courseType}
                            onChange={handleChange}
                        >
                            <option value="">Select Level</option>
                            <option value="Masters">Masters / MBA</option>
                            <option value="Bachelors">Bachelors</option>
                            <option value="PhD">PhD</option>
                            <option value="Diploma">Diploma</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="intake">Intake</label>
                        <input
                            type="text"
                            id="intake"
                            name="intake"
                            placeholder="e.g. Fall 2024"
                            value={formData.intake}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="stage">Current Stage (Optional)</label>
                        <select
                            id="stage"
                            name="stage"
                            value={formData.stage}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', color: '#333' }}
                        >
                            <option value="">Any Stage</option>
                            <option value="Applying">Applying / Researching</option>
                            <option value="Offer">Offer Received</option>
                            <option value="Visa">Visa Process</option>
                            <option value="Arrived">Just Arrived / Settling In</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="specialization">Specialization / Major</label>
                    <input
                        type="text"
                        id="specialization"
                        name="specialization"
                        placeholder="e.g. Computer Science, Marketing, Engineering"
                        value={formData.specialization}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" style={{ width: '100%' }}>
                    Discover Communities
                </button>
            </form>
        </div>
    );
};

export default StudentForm;
