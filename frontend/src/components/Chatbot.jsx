import { useEffect } from 'react';

const Chatbot = () => {
  useEffect(() => {
    const chatbotExists = document.getElementById('SPYCE-CHATBOT-ID');
    console.log(chatbotExists);

    // This creates the chatbot if it does NOT exist
    if (chatbotExists === null) {
      const script1 = document.createElement('script');
      script1.id = 'SPYCE-CHATBOT-ID';
      console.log(script1);
      script1.src = 'https://cdn.botpress.cloud/webchat/v0/inject.js';
      script1.async = true;

      script1.onload = () => {
        // Call the init function once inject.js has loaded
        window.botpressWebChat.init({
          composerPlaceholder: 'Chat with Spycebot',
          botConversationDescription: "Lets see what's cookin, good lookin!",
          botId: '9bff00fe-2cd9-4051-a9dd-fea336e354ca',
          hostUrl: 'https://cdn.botpress.cloud/webchat/v0',
          messagingUrl: 'https://messaging.botpress.cloud/',
          clientId: '9bff00fe-2cd9-4051-a9dd-fea336e354ca',
          botName: 'Spycebot',
          avatarUrl:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOGdGdJJl5qpdMgR6dlGvwXJUlcNRuveJMHg&usqp=CAU',
          website: 'spyce.com',
          stylesheet:
            'https://webchat-styler-css.botpress.app/prod/code/409637d6-d1be-4edd-8538-c51d4ca3bab6/v11014/style.css',
          useSessionStorage: true,
          showBotInfoPage: true,
        });
      };

      // Cleanup function to remove scripts when component unmounts
      return () => {
        document.body.appendChild(script1);
      };
    }
  }, []); // Empty array ensures effect is only run on mount and unmount
};

export default Chatbot;
