import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { SHEETS } from '../src/shared/constants/sheets.constants';

const privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3+B3TB8Zl+A5R\n6THt0RVYkrPHasBt3bad/hNEqIGs0wbhnbd+bwNUHrgPCnPmX3MVATzs/it38Xsr\n0NTVKuw5xZZRYkDsYUD+Z9x9/oPTzQ90fp4Sx+Y11cgI0wEMmuVqd8V8NN3KTDpW\nFHtA/jf/Sk3KXlb0qfU+EzntKXPySVrSiQMnxlIUWTJY/4PQ1TBaQwFaETZBV3Kw\nkLXhjC0JtfNBsyJQ1GdwkDxZ8S8qtpojzx/RQ0EItFwhDeThMtTwnliAAS4kjL5K\nLI4D0BKEvD4VfShpv43tqrVgRLHzbXkd4VXUo0DLneyKe10DCLxxnqoed4C2EzcR\nRIcprFLhAgMBAAECggEAGUekDt1Q+wQfhkv4IMjhbl7CYOh0xuQiSwr16jJe7LkW\n3KadPLzT2pmvYIm8LBpOUxhCH1g8mup5ACgIhxOzNavGyyooPRM5fibBhXgVn2OH\nTdJ0YE+jJ8oCXIwPkdmF0EqNvaf6GOlpVBjTvbZGoEhn8M4OlDz38UQXv/+OlOrE\nedIO6VkxUX1bVg+fpcr35DF0sMAzxMmOuevQVwWpEaoBMY3ctvXlYK+pKotwK35a\naDCMRU5Uav7tcvaYP4QY8bKD5TlOaIxONUFDLIjEJA3N8oz8G2/cfIHAOwYLu0o+\nLKZq0TOPiwXORCvCb/3b/zZHq60GJ9lP00UH4G3HPQKBgQDoBrfmMrpu827verCJ\n0i7uetHKq/OCNtulR3AhTd63hkh1xa+3/tiWGIHVkFt/AM8JL/NTUqov6fPbmPbQ\nIaxCC5iTdSj41IGNzAQ1Srqr+FhlN693wUZd2ey7c1d7HkmqrPEBXA0aFvyYksXn\nRfwqTO/bAijdIFc794LspBt5kwKBgQDK+kAqD0zVGErIpC1nUiPAI5IgGBfe3HE4\n+2eGjsnHXPbofCnSR/qm8YVGq0imnUN42bKuUbRuN5/1wZ1hiNoC96XXeF3GrkHm\nBK13Iry/Vs67HNiT407JfBbV7Mk+HBVygNdBAnuA+y83M1tBMcAmssnr+9VzswKE\nMd22moQ6OwKBgAK6yYEQybaycHSqydblPR4bHcq3mSbIBG9+VqhdpSgdkU6pY7bT\nbbLeWPCtQRZOaSEfikpJp6zmoLLNquGp87/XKRVbBH9g6KFFbCtAVM/fHRMbw5my\nEWTbQni2E6pkIdO7Mx6j+Zd7+77Dw0ZEQYIx44R9EwP+9GfFMqocCCK3AoGBAIiv\ryfjt8TEoA+vZ5ftW3/XNF8CeoisgF50Bko5u63Sb78tZehiamujtzFYxQrWWop2\nZ3o2MUALm1+eq4Hz64QWCwsn1lamIGBqg/n3XY2oQn0EtuAYMYVDWAlldDusI9FA\n7DOuHUdFX41XuzsS6qfkvE96/kn0oVwuTHTcZvDjAoGBAJ5eydoT+KUPLVf+0UZd\npZWd5mgCoX4GbzuKT0KNDAqsqUHQd8/X7ztRL2kY/ANCDO8T2bDdFfo7IFOQxLyW\nOY7spvO0TaxQVrs7YgrRNTTCjTGYxFINMjozeoBMr8QnQrzXy53M78UAYq/eAW5t\nNKS81FmdNbJU79b8d8zSNCdf\n-----END PRIVATE KEY-----\n";

const serviceAccountEmail = "pos-system-role-select-proje@cool-tooling-477111-s0.iam.gserviceaccount.com";
const spreadsheetId = "1IQLMM2p1dTE1Sq_9SyNreJo2rvc8D4ZbG0DqCjIjqps";

async function forceInit() {
  console.log('Force Initializing Google Sheets...');
  const auth = new JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheetsApi = google.sheets({ version: 'v4', auth });

  try {
    const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });
    const existingSheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];

    if (!existingSheetTitles.includes(SHEETS.CONFIG)) {
      console.log('Creating sheet: ' + SHEETS.CONFIG);
      await sheetsApi.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: SHEETS.CONFIG } } }],
        },
      });
    }

    console.log('Setting headers and seeding CONFIG...');
    await sheetsApi.spreadsheets.values.update({
      spreadsheetId,
      range: SHEETS.CONFIG + '!A1:B3',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          ['key', 'value'],
          ['username', 'admin'],
          ['password', 'admin'],
        ],
      },
    });

    console.log('Force Initialization Complete!');
  } catch (error) {
    console.error('Failed to initialize sheets:', error);
  }
}

forceInit();
