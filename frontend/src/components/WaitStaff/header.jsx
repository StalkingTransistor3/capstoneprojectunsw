import React from 'react';

export default function Header({ title = 'Page Title', buttonFunc = 'back' }) {
  return (
    <>
      <div className="header-wrapper">
        <div className="header-title-container">
          <div className="dashboard-header-title">{title}</div>
        </div>
        <hr className="header-divider" />
      </div>
    </>
  );
}
