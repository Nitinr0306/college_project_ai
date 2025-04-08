import { useState } from 'react';
import {
  Webchat,
  WebchatProvider,
  Fab,
  getClient,
  Configuration,
} from '@botpress/webchat';

// This should be replaced with your actual client ID from Botpress
const clientId = "F1GR806Y";

const configuration: Configuration = {
  color: '#18b18f', // Using our primary color
  botName: 'Sustainability Assistant',
  website: {
    title: 'Learn more about sustainability',
    link: 'https://example.com'
  },
  botAvatar: '',
  useSessionStorage: true,
  showBotInfoPage: false,
  showCloseButton: true,
  enableConversationDeletion: false, 
  showTimestamp: true,
  hideWidget: false
};

export default function BotpressChat() {
  const client = getClient({
    clientId,
  });

  const [isWebchatOpen, setIsWebchatOpen] = useState(false);

  const toggleWebchat = () => {
    setIsWebchatOpen((prevState) => !prevState);
  };

  return (
    <WebchatProvider client={client} configuration={configuration}>
      <div className="fixed bottom-8 right-8 z-50">
        <Fab onClick={toggleWebchat} />
        <div
          style={{
            display: isWebchatOpen ? 'block' : 'none',
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '350px',
            height: '520px',
            zIndex: 9999,
          }}
        >
          <Webchat />
        </div>
      </div>
    </WebchatProvider>
  );
}