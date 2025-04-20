document.addEventListener('DOMContentLoaded', function() {
    // Get the chat form, input field, and messages container
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatStatus = document.getElementById('chat-status');
    
    // Initialize chat history
    let chatHistory = [];
    
    // Handle form submission
    chatForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const userMessage = chatInput.value.trim();
        if (!userMessage) return;
        
        // Add user message to chat
        addMessageToChat('user', userMessage);
        
        // Clear input field
        chatInput.value = '';
        
        // Show loading indicator
        chatStatus.classList.remove('hidden');
        
        // Set a reasonable timeout for the request
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Request timed out')), 15000)
        );
        
        // Create the fetch request
        const fetchPromise = fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: userMessage
            })
        });
        
        // Race between fetch and timeout
        Promise.race([fetchPromise, timeoutPromise])
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Hide loading indicator
                chatStatus.classList.add('hidden');
                
                if (data.success) {
                    // Log successful response
                    console.log("Chatbot response received:", data.response.substring(0, 50) + "...");
                    
                    // Add bot response to chat
                    addMessageToChat('bot', data.response);
                } else {
                    console.error("API error:", data.error);
                    
                    // Show error message
                    addMessageToChat('bot', 'Sorry, I encountered an error: ' + (data.error || 'Unknown error'));
                }
                
                // Scroll to the bottom of the chat
                scrollToBottom();
            })
            .catch(error => {
                console.error('Error with chat request:', error);
                
                // Hide loading indicator
                chatStatus.classList.add('hidden');
                
                // Create a more helpful message based on the error
                let errorMessage = 'I\'m having trouble connecting to my knowledge base right now. ';
                
                if (error.message.includes('timed out')) {
                    errorMessage += 'The request took too long to process. I\'m running in offline mode with pre-defined sustainability tips.';
                } else if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
                    errorMessage += 'There seems to be a network issue. I\'ll provide some sustainability tips instead.';
                } else {
                    errorMessage += 'Here\'s a sustainability tip while I recover: Reduce, reuse, and recycle to minimize your environmental impact.';
                }
                
                // Show error message
                addMessageToChat('bot', errorMessage);
                scrollToBottom();
            });
    });
    
    // Function to add a message to the chat
    function addMessageToChat(sender, message) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        
        let iconClass = sender === 'bot' ? 'fa-robot' : 'fa-user';
        let bgColorClass = sender === 'bot' ? 'bg-primary' : 'bg-secondary';
        let messageColorClass = sender === 'bot' ? 'bg-gray-100' : 'bg-blue-50';
        let alignment = sender === 'bot' ? 'items-start' : 'items-end justify-end';
        
        messageElement.innerHTML = `
            <div class="flex ${alignment} mb-4">
                <div class="flex-shrink-0 ${bgColorClass} rounded-full p-2 ${sender === 'user' ? 'ml-3 order-2' : 'mr-3'}">
                    <i class="fas ${iconClass} text-white"></i>
                </div>
                <div class="${messageColorClass} rounded-lg py-2 px-4 max-w-[80%]">
                    <p>${formatMessage(message)}</p>
                </div>
            </div>
        `;
        
        // Add to chat container
        chatMessages.appendChild(messageElement);
        
        // Add to chat history
        chatHistory.push({
            sender: sender,
            message: message
        });
        
        // Apply fade-in animation
        messageElement.classList.add('animate-fade-in');
        
        // Scroll to the bottom
        scrollToBottom();
    }
    
    // Function to format message text with line breaks and links
    function formatMessage(text) {
        // Replace newlines with <br>
        let formatted = text.replace(/\n/g, '<br>');
        
        // Make URLs clickable
        formatted = formatted.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-blue-500 hover:underline">$1</a>');
        
        return formatted;
    }
    
    // Function to scroll chat to the bottom
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Focus input field when the page loads
    chatInput.focus();
});
