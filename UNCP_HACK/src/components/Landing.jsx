import React from 'react'
import './Landing.css'
import Typewriter from 'typewriter-effect';
import GetStartedButton1 from './GetStartedButton1';
import barbellIcon from '../assets/barbell-icon.svg';
import leftBarbell from '../assets/leftBarbell.webp';
import rightBarbell from '../assets/rightBarbell.webp';

import BotButton from './BotButton';


const Landing = () => {

  return (
    <div className='wrapper'>
        <div className="barbell-title-wrap">
            <img src={leftBarbell} alt="barbell" className="barbell-icon" />
            <h1 className="barbell-title-text">
                <span className="lift-green">LIFT</span><span className="mate">MATE</span>
            </h1>
            <img src={rightBarbell} alt="barbell" className="barbell-icon flipped" />
        </div>


        <div className='typewriter'>
            <Typewriter
                options={{
                    strings: [
                        'Hey there! This is your personal virtual lifting buddy.',
                        "Let's start you off with Squats, Deadlifts, or Bench Press!",
                        'Select one of these compound movements, and we will analyze your form!'
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 40,
                    pauseFor: 1500
                }}
            />
        </div>
            <div className="exercise-sections">
                <div className="exercise" onMouseEnter={() => document.getElementById('squatVideo').play()} onMouseLeave={() => document.getElementById('squatVideo').pause()}>
                    <h2>Squat</h2>
                    <video
                    id="squatVideo"
                    className="exercise-media"
                    width="100%"
                    height="auto"
                    muted
                    loop
                    preload="metadata"
                    >
                        <source src="/Squat_Video.mp4" type="video/mp4" />
                    </video>
                    <p>Squats build strength in your quads, hamstrings, glutes, and posterior chain.</p>
                </div>

                <div
                    className='exercise'
                    onMouseEnter={() => document.getElementById('benchVideo').play()}
                    onMouseLeave={() => document.getElementById('benchVideo').pause()}
                    >
                    <h2>Bench Press</h2>
                    <video
                        id="benchVideo"
                        className='exercise-media'
                        width="100%"
                        height="auto"
                        muted
                        loop
                        preload="metadata"
                    >
                        <source src="/Bench_Video.mp4" type="video/mp4" />
                    </video>
                    <p>Bench Press targets chest, triceps, and anterior delts.</p>
                </div>

                <div
                    className='exercise'
                    onMouseEnter={() => document.getElementById('deadliftVideo').play()}
                    onMouseLeave={() => document.getElementById('deadliftVideo').pause()}
                    >
                    <h2>Deadlift</h2>
                    <video
                        id="deadliftVideo"
                        className='exercise-media'
                        width="100%"
                        height="auto"
                        muted
                        loop
                        preload="metadata"
                    >
                        <source src="/Deadlift_Video.mp4" type="video/mp4" />
                    </video>
                    <p>Deadlifts emphasize the posterior chain and grip strength.</p>
                </div>
            <div className='exercise-button'>
                <GetStartedButton1/>
            </div>
        </div>
        <BotButton/>
    </div>
  )
}

export default Landing