import 'dotenv/config';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { SHEETS } from '../src/shared/constants/sheets.constants';

async function initSheets() {
  console.log('Initializing Google Sheets...');

  const rawKey = process.env.GOOGLE_PRIVATE_KEY || '';
  const formattedKey = rawKey
    .trim()
    .replace(/^['"](.*)['"]$/, '$1')
    .replace(/\\n/g, '\n');

  const auth = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL?.trim(),
    key: formattedKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheetsApi = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  const requiredSheets = [
    { title: SHEETS.PRODUCT_MASTER, headers: ['id', 'name', 'category', 'unitPrice', 'costPrice', 'stockQuantity', 'minStockLevel', 'updatedAt'] },
    { title: SHEETS.SALES_HEADER, headers: ['billNumber', 'date', 'totalAmount', 'profit', 'paymentMethod', 'customerName', 'requestId'] },
    { title: SHEETS.SALES_ITEMS, headers: ['billNumber', 'productId', 'quantity', 'unitPrice', 'costPrice', 'subTotal'] },
    { title: SHEETS.STOCK_MOVEMENTS, headers: ['id', 'productId', 'type', 'quantity', 'reason', 'referenceId', 'createdAt'] },
    { title: SHEETS.DAILY_SUMMARY, headers: ['date', 'totalSales', 'totalProfit', 'totalTransactions', 'totalItemsSold', 'updatedAt'] },
    { title: SHEETS.CONFIG, headers: ['key', 'value'] },
    { title: SHEETS.USERS, headers: ['username', 'password_hash', 'role', 'active'] },
  ];

  try {
    const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });
    const existingSheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];

    // Create missing sheets
    for (const sheet of requiredSheets) {
      if (!existingSheetTitles.includes(sheet.title)) {
        console.log(`Creating sheet: ${sheet.title}`);
        await sheetsApi.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: { title: sheet.title },
                },
              },
            ],
          },
        });
      }

      // Add headers
      console.log(`Setting headers for: ${sheet.title}`);
      await sheetsApi.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheet.title}!A1:Z1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [sheet.headers],
        },
      });
    }

    // Seed USERS sheet if empty
    const userData = await sheetsApi.spreadsheets.values.get({ spreadsheetId, range: `${SHEETS.USERS}!A2:A` });
    if (!userData.data.values || userData.data.values.length === 0) {
        console.log('Adding default admin to USERS...');
        // admin123 hash
        const adminHash = '$2a$10$0M6U1F4H79VfD4.7F/0g/u7Hj27zB2o9D0I5V7S6Z.h1.M9E3zPqW'; 
        await sheetsApi.spreadsheets.values.append({
            spreadsheetId,
            range: `${SHEETS.USERS}!A2:D2`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [['admin', adminHash, 'admin', 'TRUE']]
            }
        });
    }

    console.log('Google Sheets Initialization Complete!');
  } catch (error) {
    console.error('Failed to initialize sheets:', error);
  }
}

initSheets();
