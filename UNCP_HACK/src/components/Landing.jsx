import React from 'react'
import './Landing.css'
import Typewriter from 'typewriter-effect';
import GetStartedButton1 from './GetStartedButton1';
import GetStartedButton2 from './GetStartedButton2';
import GetStartedButton3 from './GetStartedButton3';

const Landing = () => {
  return (
    <div className='wrapper'>
        <div className="barbell-title-wrap">
            <h1 className="barbell-title-text">LiftMate</h1>
        </div>


        <div className='typewriter'>
            <Typewriter
                options={{
                    strings: [
                        'Hey there! This is your personal virtual lifting buddy.',
                        "Let's start you off with Squats, Deadlifts, or Bench Press!",
                        'Fun Fact! These are the also known as the Powerlifting Big 3.'
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 30,
                    pauseFor: 2000
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
                    Your browser does not support the video tag.
                    </video>
                    <p>Squats build strength in your quads, hamstrings, glutes, and posterior chain.</p>
                    <GetStartedButton1 />
                </div>

                <div
                    className='exercise'
                    onMouseEnter={() => document.getElementById('benchVideo').play()}
                    onMouseLeave={() => document.getElementById('benchVideo').pause()}
                    >
                    <h2>Deadlift</h2>
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
                        Your browser does not support the video tag.
                    </video>
                    <p>Bench Press targets chest, triceps, and anterior delts.</p>
                    <GetStartedButton3 />
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
                        Your browser does not support the video tag.
                    </video>
                    <p>Deadlifts emphasize the posterior chain and grip strength.</p>
                    <GetStartedButton3 />
                </div>

        </div>


        <div className='quote'>
        "The resistance that you fight physically in the gym and the resistance that you 
            fight in life can only build a strong character."" <br /> - Arnold Schwarzenegger
        </div>
    </div>
  )
}

export default Landing