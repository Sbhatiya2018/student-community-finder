import React from 'react';

const CommunityList = ({ communities }) => {
    if (!communities) return null;

    if (communities.length === 0) {
        return (
            <div className="card result-section fade-in">
                <div className="empty-state">
                    <h3>No specific matches found</h3>
                    <p>Try adjusting your search filters or check out our global communities.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="result-section fade-in">
            <h2 style={{ textAlign: 'left', marginLeft: '0.5rem' }}>Recommended For You</h2>
            <div className="community-grid">
                {communities.map(comm => (
                    <div key={comm.id} className="community-card">
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{comm.name}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{comm.description}</p>

                            <div className="tags">
                                {comm.tags.country && <span className="tag">{comm.tags.country}</span>}
                                {comm.tags.courseType && <span className="tag">{comm.tags.courseType}</span>}
                                {comm.tags.field && <span className="tag">{comm.tags.field}</span>}
                            </div>
                        </div>

                        <a
                            href={comm.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`join-btn ${comm.platform.toLowerCase()}`}
                        >
                            Join {comm.platform} Group
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommunityList;
