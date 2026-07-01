import 'dotenv/config';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

async function createSpreadsheet() {
  console.log('Creating a new Google Sheet for your POS...');
  const auth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });
  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const res = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'Five Star POS Database',
        },
      },
    });

    const spreadsheetId = res.data.spreadsheetId;
    console.log(`Successfully created sheet! ID: ${spreadsheetId}`);
    console.log(`URL: https://docs.google.com/spreadsheets/d/${spreadsheetId}`);
    
    return spreadsheetId;
  } catch (error) {
    console.error('Error creating spreadsheet:', error);
    process.exit(1);
  }
}

createSpreadsheet().then(id => console.log(id));
