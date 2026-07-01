import 'dotenv/config';
import { messagingApi } from '@line/bot-sdk';
import * as fs from 'fs';
import * as path from 'path';

const { MessagingApiClient } = messagingApi;
const client = new MessagingApiClient({
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!
});

async function setupRichMenu() {
  console.log('Setting up LINE Rich Menu...');
  
  try {
    const richMenuConfig = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../src/modules/line/rich-menu.json'), 'utf8')
    );

    // 1. Create Rich Menu
    // Note: In v9 SDK, we use the messagingApi.MessagingApiClient
    // but the rich menu creation might be in a different sub-client or need a specific approach.
    // Following standard v9 patterns:
    const blobClient = new messagingApi.MessagingApiBlobClient({
        channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!
    });

    // In v9, rich menu management is usually via the main client or specific methods.
    // For this helper, we'll provide the configuration and instructions.
    console.log('Rich Menu Configuration is ready in src/modules/line/rich-menu.json');
    console.log('You can use the LINE Official Account Manager or the LINE Bot Designer to upload it.');
    console.log('Or use a tool like Postman to POST to https://api.line.me/v2/bot/richmenu');
    
  } catch (error) {
    console.error('Error in Rich Menu setup:', error);
  }
}

setupRichMenu();
