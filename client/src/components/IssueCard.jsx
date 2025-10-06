import React from 'react';

/**
 * IssueCard
 * Props:
 *  - issue: issue object from backend
 *  - onStatusChange(id, status): function to change issue status
 *  - onClick(issue): optional, e.g. open modal / focus map
 */
export default function IssueCard({ issue, onStatusChange, onClick }) {
  const {
    _id,
    title,
    description,
    imageUrl,
    status,
    priority,
    category,
    createdAt,
    rating,
  } = issue;

  const shortDesc = description ? (description.length > 140 ? description.slice(0, 137) + '...' : description) : '';

  return (
    <div style={{
      border: '1px solid #e1e1e1',
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      marginBottom: 12,
      background: '#fff'
    }}>
      {imageUrl && (
        <div style={{ width: '100%', height: 140, overflow: 'hidden' }}>
          <img
            src={imageUrl}
            alt={title || category}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <div style={{ padding: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <h4 style={{ margin: 0, fontSize: 16 }}>{title || category || 'Untitled issue'}</h4>
          <small style={{ color: '#666' }}>{new Date(createdAt).toLocaleString()}</small>
        </div>

        <p style={{ margin: '8px 0', color: '#333', fontSize: 14 }}>{shortDesc}</p>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: 12, padding: '4px 8px', borderRadius: 6,
            background: priority === 'High' ? '#ffe6e6' : '#f1f8ff',
            color: priority === 'High' ? '#b30000' : '#0366d6'
          }}>{priority} priority</span>

          <span style={{ fontSize: 12, color: '#777' }}>{status}</span>

          {rating != null && <span style={{ fontSize: 12, color: '#777' }}>⭐ {rating}</span>}
        </div>

        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
          <button
            onClick={() => onStatusChange && onStatusChange(_id, 'In Progress')}
            disabled={status === 'In Progress' || status === 'Resolved'}
            style={{ padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
          >
            Start
          </button>

          <button
            onClick={() => onStatusChange && onStatusChange(_id, 'Resolved')}
            disabled={status === 'Resolved'}
            style={{ padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
          >
            Resolve
          </button>

          <button
            onClick={() => onClick && onClick(issue)}
            style={{ padding: '6px 10px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
