import React from 'react';
import { Image } from 'antd';
import './HomePage.css';
import AnimatedText from "../Components/AnimatedText"

const HomePage = () => {
    const windowHeight = window.innerHeight;
  
    return (
      <div style={{ position: 'relative' }}>
        <Image
          src="http://user-images.strikinglycdn.com/res/hrscywv4p/image/upload/navqy40ywcdu0bt9z0di.jpg"
          alt="image"
          className="image"
          height={windowHeight - 67}
          width="100%"
          preview={false}
        />
        <div className="container">   
            <h3 className="subtitle">
              <span className="line hide" data-bind="visible:text1.value().length > 0"></span>             
                <div data-component="text" data-name="text1" data-text-type="body" className="text-component">
                  <div data-bind="visible: !(text1.isState('editor') || !text1.hasContent()), htmlValue: text1.value, style: window.edit_page.data.fontStyle('bodyFont') ">
                    WORK SMARTER, NOT HARDER
                  </div>
                </div>             
              <span className="line" data-bind="visible:text1.value().length > 0"></span>
            </h3>
            <h1 className="title big">
                <div data-component="text" data-name="text2" data-text-type="title" className="text-component">
                    <div className="content" data-bind="visible: !(text2.isState('editor') || !text2.hasContent()), htmlValue: text2.value, style: window.edit_page.data.fontStyle('titleFont') ">
                        <div className="css-pro-current" contentEditable="true"><AnimatedText text="WELCOME TO EA OPERATION PORTAL"/>
                        </div>
                    </div>
                </div>
            </h1>
        </div>     
      </div>
    );
  };

export default HomePage;
