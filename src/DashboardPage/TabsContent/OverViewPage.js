import React from 'react';
import { Card, Input, List} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './OverViewPage.css';
import ChartCard from './ChartCard';
import MismatchList from "./MismatchList";

const SummaryCard = ({ title, description, backgroundColor }) => {
    console.log("description", description)
    return (
      <Card
        className="summary-card card-bg-color${index + 1}"
        size="small"
        hoverable
        title={title}
        style={{ backgroundColor }}
      ><p>{description}</p></Card>
    );
  };
  
  const cardItems = [
    { title: "SMP GROUP", description: "0"},
    { title: "TAP VERSION", description: "1"},
    { title: "TCS VERSION", description: "2"},
    { title: "TKS TOOL RATIO", description: "3"},
  ];
  
  const OverViewPage = () => {
    return (
      <div className="overview-page">
        <div className="above-container">
          <Card className="summary-card-container" size="small" title="Summary">
            <div className="summary-card-position">
              {cardItems.map((card) => (
                <SummaryCard
                  key={card.title}
                  title={card.title}
                  description={card.description}
                  backgroundColor={card.backgroundColor}
                />
              ))}
            </div>
          </Card>
          <ChartCard />
          <MismatchList/>
        </div>
      </div>
    );
  };

export default OverViewPage;
