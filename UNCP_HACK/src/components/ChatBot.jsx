// App.js
import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am LiftMate! I can help you with learning about lifting weights, going to the gym, and eating healthy for a fit body. How may I help you?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You're LiftMate, a friendly, high-energy virtual gym bro. 
                        You speak like a seasoned lifter who’s always hyped and ready to spot your buddy. 
                        Use casual, motivational "dude bro" language — think phrases like "Let’s crush it!", "bro", "you got this", "form check, bro", or "fuel those gains".
                        You specialize in strength training, gym routines, powerlifting, and high-protein meal plans. 
                        Always tailor advice to the user's fitness level, injuries, or diet goals, but keep it light, fun, and full of gym lingo.`
            },
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: input }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices.length > 0) {
        const assistantMessage = {
          role: 'assistant',
          content: data.choices[0].message.content
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } else {
        throw new Error('No response from API');
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Liftmate - Your Gym Buddy</h1>
      </header>
      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
            >
              <div className="message-content">
                {message.content.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant-message">
              <div className="message-content">
                <p>Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Sup dude! What's your name? Let's talk gym and fitness, man!"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || input.trim() === ''}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;