import React from 'react';
import { Modal, List, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './SearchResultsModal.css'

const SearchResultsModal = ({ isModalOpen, handleOk, handleCancel, searchResults }) => {
    const navigate = useNavigate();

    const goToItem = (path) => {
        navigate(path);
        handleOk();  // Assuming handleOk will also close the modal
    };

    return (
        <Modal
            title="Search Results"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Cancel
                </Button>
            ]}
        >
            <List
                className='search-list'
                itemLayout="horizontal"
                bordered
                dataSource={searchResults}
                renderItem={(item, index) => (
                    <List.Item key={index} actions={[
                        <a key="list-go" onClick={() => goToItem(item.path)}>Go To</a>
                    ]}>
                        <List.Item.Meta
                            title={item.title}
                            description={item.content}
                        />
                    </List.Item>
                )}
            />
        </Modal>
    );
};

export default SearchResultsModal;
