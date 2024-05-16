import React, { useState } from 'react';
import './LandingPage.css';
import AnimatedText from "../Utils/AnimatedText";
import TeamMemberCard from "./Components/TeamMemberCard";
import { Input, Space, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import SearchResultsModal from './Components/SearchResultsModal';

const { Search } = Input;

const LandingPage = (props) => {

    const navigate = useNavigate();
    const menuItems = props.menuItems;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const onSearch = (value) => {
        console.log("Search Input:", value);
        const filteredResults = menuItems.filter(item =>
            item?.content.toLowerCase().includes(value.toLowerCase())
        );
        console.log("filteredResults", filteredResults)
        setSearchResults(filteredResults);
        setIsModalOpen(true);
    };


    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="landing-page">
            <div className="header-section">
                <AnimatedText text="WELCOME TO EA OPERATION PORTAL" />
                <Search placeholder="Search..." onSearch={onSearch} className="search-input" />
            </div>

            <h1 className="h1">Team Member</h1>

            <div className="card-container">
                <TeamMemberCard
                    title="Member A - Operations and Development Specialist"
                    primaryResponsibilities="Member A manages all operations, ensuring smooth day-to-day activities aligned with project goals."
                    additionalInfo="Besides operations, A occasionally takes part in backend development, assisting the tech team with complex issues."
                />
                <TeamMemberCard
                    title="Member B - Full Stack Developer and Designer"
                    primaryResponsibilities="B is the technical core of the team, responsible for both front-end and back-end development."
                    additionalInfo="Also serves as the front-end designer, in charge of the product’s visual and user experience design."
                />
                <TeamMemberCard
                    title="Outsourced Team - Specialized Support"
                    primaryResponsibilities="Two outsourced members handle miscellaneous operational tasks, ensuring efficiency in business processes."
                    additionalInfo="One focuses on backend development support, while the other assists with front-end development, ensuring technical projects proceed as planned."
                />
            </div>

            <SearchResultsModal
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
                searchResults={searchResults}
            />
        </div>
    );
};

export default LandingPage;
