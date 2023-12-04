'use client';

import { motion } from 'framer-motion';
import { TypingText } from '../components';

import styles from '../styles';
import { fadeIn, staggerContainer } from '../utils/motion';
import FileUploadBox from './fileUpload';
import { slideIn, textVariant } from '../utils/motion';
import { useRef } from 'react';
import React, { useState } from 'react';

export const planetVariants = (direction) => ({
  hidden: { opacity: 0, x: 100 }, // Initial state, hidden and moved 100px to the right
  visible: { opacity: 1, x: 0 }, // Visible state, no transformation
});


const About = () => {

  const [receivedData, setReceivedData] = useState('');

  const handleDataReady = (data) => {
    console.log('Data from FileUploadBox:', data);
    setReceivedData(data);
  };

  return(
  <section className={`${styles.paddings} relative z-10`}>
    <div className="gradient-02 z-0" />
  <section className={`${styles.flexCenter} sm:pl-16 pl-6`} id="Dropbox">
    
    <FileUploadBox onDataReady={handleDataReady}/>

    </section>
    {receivedData && (
      <div className={`${styles.flexCenter} mt-4 text-white`}>
        <p>{`Received Data: ${receivedData}`}</p>
      </div>
    )}
    <div style={{ marginTop: '110px' }}></div>
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.25 }}
      className={`${styles.innerWidth} mx-auto ${styles.flexCenter} flex-col`}
    >
      <TypingText title="What is Peach Predict?" textStyles="text-center" />

      <motion.p
        variants={fadeIn('up', 'tween', 0.2, 1)}
        className="mt-[8px] font-normal sm:text-[32px] text-[20px] text-center text-secondary-white"
      >
        <span className="font-extrabold text-white">Peach Predict</span>

        <span className="font-extrabold text-white"> is a revolutionary tool designed to empower homebuyers and real estate 
        enthusiasts with the capability to predict property prices in multiple locations on any given date. Leveraging the power of machine learning and 
        data analytics, this app brings transparency and valuable insights to the real estate market, making it easier for users to make informed decisions </span>{' '}
      </motion.p>
      <div><img src="big_house.png" alt="Description" /></div>
    </motion.div>
  </section>
  );
  };

export default About;