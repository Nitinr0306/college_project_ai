document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatStatus = document.getElementById('chat-status');

    // Initialize chat history
    let chatHistory = [];

    // Handle form submission
    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const userMessage = chatInput.value.trim();
        if (!userMessage) {
            addMessageToChat('bot', '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Please enter a question.</div>');
            return;
        }

        // Add user message to chat and clear input
        addMessageToChat('user', userMessage);
        chatInput.value = '';

        // Show loading indicator
        chatStatus.classList.remove('hidden');

        try {
            // Set timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out')), 15000)
            );

            // Fetch request to backend
            const fetchPromise = fetch('/gemini-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            // Race between fetch and timeout
            const response = await Promise.race([fetchPromise, timeoutPromise]);

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            const data = await response.json();

            // Hide loading indicator
            chatStatus.classList.add('hidden');

            if (data.success) {
                const botResponse = parseBotResponse(data.response);
                addMessageToChat('bot', botResponse);
            } else if (data.error) {
                const errorMessage = formatErrorMessage(data.error);
                addMessageToChat('bot', errorMessage);
            } else {
                addMessageToChat('bot', formatErrorMessage('No response from server.'));
            }
        } catch (error) {
            console.error('Error with chat request:', error);

            // Hide loading indicator
            chatStatus.classList.add('hidden');

            // Format error message based on the error type
            const errorMessage = formatErrorMessage(error.message || error);
            addMessageToChat('bot', errorMessage);
        }

        // Scroll to the bottom of the chat
        scrollToBottom();
    });

    // Function to parse bot response
    function parseBotResponse(response) {
        const parsedResponse =
            typeof response === 'string'
                ? response
                : response?.candidates?.[0]?.content?.parts?.[0]?.text ||
                  response?.response ||
                  response?.message?.content ||
                  response?.message ||
                  response;

        return formatMessage(parsedResponse);
    }

    // Function to format error messages
    function formatErrorMessage(error) {
        let message = '<div class="error-message"><i class="fas fa-exclamation-triangle"></i> ';

        if (error.includes('timed out')) {
            message += 'The request took too long to process. Please try again later.';
        } else if (error.includes('Failed to fetch') || error.includes('Network')) {
            message += 'There seems to be a network connectivity issue. Please check your internet connection.';
        } else if (error.includes('404')) {
            message += 'The API endpoint was not found. Please verify the API URL is correct.';
        } else if (error.includes('500')) {
            message += 'Server error occurred. Please try again later.';
        } else if (error.includes('401')) {
            message += 'Authentication failed. Please refresh the page and try again.';
        } else if (error.includes('400')) {
            message += 'Invalid request. Please check your input and try again.';
        } else {
            message += `An unexpected error occurred: ${error}`;
        }

        message += '</div>';
        return message;
    }

    // Function to add a message to the chat
    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);

        const iconClass = sender === 'bot' ? 'fa-robot' : 'fa-user';
        const bgColorClass = sender === 'bot' ? 'bg-primary' : 'bg-secondary';
        const messageColorClass = sender === 'bot' ? 'bg-gray-100' : 'bg-blue-50';
        const alignment = sender === 'bot' ? 'items-start' : 'items-end justify-end';

        messageElement.innerHTML = `
            <div class="flex ${alignment} mb-4">
                <div class="flex-shrink-0 ${bgColorClass} rounded-full p-2 ${sender === 'user' ? 'ml-3 order-2' : 'mr-3'}">
                    <i class="fas ${iconClass} text-white"></i>
                </div>
                <div class="${messageColorClass} rounded-lg py-2 px-4 max-w-[80%]">
                    <p>${message}</p>
                </div>
            </div>
        `;

        chatMessages.appendChild(messageElement);
        chatHistory.push({ sender, message });
        messageElement.classList.add('animate-fade-in');
        scrollToBottom();
    }

    // Function to format message text with line breaks and links
    function formatMessage(text) {
        let formatted = text.replace(/\n/g, '<br>');
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