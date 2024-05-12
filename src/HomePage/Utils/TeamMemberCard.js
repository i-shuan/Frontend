// TeamMemberCard.jsx
import React from 'react';
import './TeamMemberCard.css'; // 確保引入正確的 CSS 檔案

const TeamMemberCard = ({ title, primaryResponsibilities, additionalInfo }) => {
  return (
    <div className="team-member-card">
      <h3>{title}</h3>
      <p><strong>Primary Responsibilities:</strong> {primaryResponsibilities}</p>
      <p>AdditionalInfo: {additionalInfo}</p>  {/* 確保這行代碼存在來顯示額外資訊 */}
    </div>
  );
};

export default TeamMemberCard;
