const { google } = require('googleapis');
const formidable = require('formidable');
const fs = require('fs');

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);
    
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!name || !email || !file) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialize Google APIs with service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`,
      },
      scopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const drive = google.drive({ version: 'v3', auth });
    const sheets = google.sheets({ version: 'v4', auth });

    // Upload file to Google Drive
    const fileMetadata = {
      name: file.originalFilename,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Your Google Drive folder ID
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.filepath),
    };

    const driveResponse = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,webViewLink',
    });

    const fileUrl = driveResponse.data.webViewLink;

    // Add data to Google Sheets
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID; // Your Google Sheets ID
    const range = 'Sheet1!A:D'; // Adjust range as needed

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[new Date().toISOString(), name, email, fileUrl]],
      },
    });

    // Clean up temporary file
    fs.unlinkSync(file.filepath);

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileUrl: fileUrl,
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: 'Upload failed',
      details: error.message,
    });
  }
}

// Configure the API route
export const config = {
  api: {
    bodyParser: false, // Disable body parsing, we'll use formidable
  },
};

