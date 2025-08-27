# File Upload Form with Google Drive & Sheets Integration

A modern, responsive file upload form that automatically saves uploaded files to Google Drive and logs submission data to Google Sheets. Built for deployment on Vercel with serverless functions.

## Features

- **Modern UI**: Clean, responsive design with loading states and file size validation
- **Google Drive Integration**: Automatically uploads files to a specified Google Drive folder
- **Google Sheets Logging**: Records submission data (timestamp, name, email, file URL) to a Google Sheet
- **File Validation**: 10MB file size limit with user-friendly error messages
- **Serverless Architecture**: Runs on Vercel's serverless functions for scalability
- **CORS Support**: Properly configured for cross-origin requests

## Project Structure

```
vercel-file-upload/
├── api/
│   └── upload.js          # Serverless function for handling uploads
├── index.html             # Main HTML form
├── styles.css             # Responsive CSS styling
├── script.js              # Frontend JavaScript
├── package.json           # Node.js dependencies
├── vercel.json            # Vercel deployment configuration
├── .env.example           # Environment variables template
└── README.md              # This file
```

## Setup Instructions

### 1. Google Cloud Setup

#### Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Drive API
   - Google Sheets API

#### Create a Service Account
1. Navigate to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Fill in the service account details
4. Click **Create and Continue**
5. Skip the optional steps and click **Done**

#### Generate Service Account Key
1. Click on your newly created service account
2. Go to the **Keys** tab
3. Click **Add Key > Create New Key**
4. Select **JSON** format and click **Create**
5. Save the downloaded JSON file securely

### 2. Google Drive Setup

#### Create a Folder
1. Go to [Google Drive](https://drive.google.com/)
2. Create a new folder for uploaded files
3. Right-click the folder and select **Share**
4. Add your service account email (found in the JSON file) with **Editor** permissions
5. Copy the folder ID from the URL (the long string after `/folders/`)

### 3. Google Sheets Setup

#### Create a Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Add headers in the first row: `Timestamp`, `Name`, `Email`, `File URL`
4. Share the spreadsheet with your service account email with **Editor** permissions
5. Copy the spreadsheet ID from the URL (the long string between `/d/` and `/edit`)

### 4. Environment Variables

Create a `.env.local` file in your project root with the following variables from your service account JSON:

```env
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_FOLDER_ID=your-drive-folder-id
GOOGLE_SPREADSHEET_ID=your-spreadsheet-id
```

**Important**: Replace the actual values with your service account credentials and IDs.

### 5. Local Development

```bash
# Install dependencies
npm install

# Install Vercel CLI (if not already installed)
npm install -g vercel

# Start local development server
vercel dev
```

The application will be available at `http://localhost:3000`

### 6. Deployment to Vercel

#### Via Vercel CLI
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Via GitHub Integration
1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy automatically on push

#### Environment Variables in Vercel
In your Vercel project dashboard:
1. Go to **Settings > Environment Variables**
2. Add all the environment variables from your `.env.local` file
3. Make sure to set them for **Production**, **Preview**, and **Development** environments

## Usage

1. Open the deployed application
2. Fill in the required fields:
   - **Name**: User's full name
   - **Email**: Valid email address
   - **File**: Any file up to 10MB
3. Click **Upload**
4. The file will be uploaded to Google Drive and data logged to Google Sheets

## API Endpoint

### POST `/api/upload`

Handles file uploads and data logging.

**Request**: Multipart form data with fields:
- `name` (string): User's name
- `email` (string): User's email
- `file` (file): File to upload

**Response**:
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "fileUrl": "https://drive.google.com/file/d/..."
}
```

**Error Response**:
```json
{
  "error": "Upload failed",
  "details": "Error message"
}
```

## Security Considerations

- Service account credentials are stored as environment variables
- File size is limited to 10MB
- CORS is configured for cross-origin requests
- Files are uploaded to a private Google Drive folder
- Only the service account has access to the Google resources

## Troubleshooting

### Common Issues

1. **"Upload failed" error**
   - Check that all environment variables are set correctly
   - Verify that the service account has access to the Drive folder and Sheet
   - Ensure the APIs are enabled in Google Cloud Console

2. **"File size must be less than 10MB" error**
   - The file exceeds the size limit
   - Consider increasing the limit in both frontend and backend code

3. **CORS errors**
   - Ensure the API function includes proper CORS headers
   - Check that the frontend is making requests to the correct endpoint

### Debugging

Enable detailed logging by adding console.log statements in the API function:

```javascript
console.log('Form data:', { name, email, fileName: file.originalFilename });
console.log('Drive response:', driveResponse.data);
```

View logs in the Vercel dashboard under **Functions > View Function Logs**.

## Customization

### Styling
Modify `styles.css` to change the appearance of the form.

### File Size Limit
Update the limit in both:
- `script.js` (frontend validation)
- `api/upload.js` (backend validation)

### Google Sheets Format
Modify the `values` array in `api/upload.js` to change what data is logged.

### File Types
Add file type validation in both frontend and backend if needed.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the Vercel and Google API documentation
3. Create an issue in the project repository

---

Built with ❤️ for seamless file uploads and data management.

