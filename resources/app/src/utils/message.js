import { createApp, h } from 'vue';
import Message from '../components/Message.vue';

const messageContainer = document.createElement('div');
document.body.appendChild(messageContainer);

let currentApp = null;

const MessageTool = {
  show(message, options = {}) {
    // 如果已有消息，先关闭
    if (currentApp) {
      currentApp.unmount();
      currentApp = null;
    }
    
    const app = createApp({
      render() {
        return h(Message, {
          message,
          duration: options.duration || 2000,
          onClose: () => {
            if (currentApp) {
              currentApp.unmount();
              currentApp = null;
            }
          },
        });
      },
    });
    
    currentApp = app;
    app.mount(messageContainer);
  },
  
  close() {
    if (currentApp) {
      currentApp.unmount();
      currentApp = null;
    }
  },
};

export default MessageTool;
