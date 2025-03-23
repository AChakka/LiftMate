import React from 'react'
import './Landing.css'
import Typewriter from 'typewriter-effect';
import GetStartedButton1 from './GetStartedButton1';
import GetStartedButton2 from './GetStartedButton2';
import GetStartedButton3 from './GetStartedButton3';

const Landing = () => {
  return (
    <div className='wrapper'>
        <h1 className='title'>LiftMate</h1>

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
        <div className='exercise-sections'>
            <div className='exercise'>
                <h2>Squat</h2>
                {/* Replace with actual video/image */}
                <div className='exercise-media'>[Squat Video]</div>
                <p>Squats build strength in your quads, hamstrings, glutes, and posterior chain. They're the foundation of strength based lifting.</p>
                <GetStartedButton1 />
            </div>

            <div className='exercise'>
                <h2>Bench Press</h2>
                <div className='exercise-media'>[Bench Video]</div>
                <p>Bench Press targets your chest, triceps, and anterior delts - making them a key part to building strength for the upper body.</p>
                <GetStartedButton2 />
            </div>

            <div className='exercise'>
                <h2>Deadlift</h2>
                <div className='exercise-media'>[Deadlift Video]</div>
                <p>Deadlifts are a full-body movement that emphasize the posterior chain, including hamstrings, glutes, lower back, and lats - you can also work on your grip strength while doing this exercise.</p>
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