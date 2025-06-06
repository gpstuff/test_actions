// Import AWS SDK for Node.js
const AWS = require('aws-sdk');

// Configure AWS with your Identity Pool
AWS.config.update({
  region: 'eu-west-1', // Replace with your region
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'eu-west-1:1074f1b8-3bbf-4ba6-a257-63cfc764b8c0' // Replace with your Identity Pool ID
  })
});

// Function to download file from S3
async function downloadFileFromS3() {
  try {
    // Create S3 service object
    const s3 = new AWS.S3();

    // Define the S3 parameters
    const params = {
      Bucket: 'test-giovanni-nuv-20555', // Replace with your bucket name
      Key: 'test-file' // Replace with your file path
    };

    console.log('Downloading file from S3...');

    // Download the file
    const data = await s3.getObject(params).promise();

    // Handle the downloaded data
    console.log('File downloaded successfully!');
    console.log('File size:', data.Body.length, 'bytes');

    // Convert to string if it's a text file
    const fileContent = data.Body.toString('utf-8');
    console.log('File content:', fileContent);

    // For binary files, you might want to create a download link
    // const blob = new Blob([data.Body], { type: data.ContentType });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'downloaded-file.txt';
    // a.click();

    return data;

  } catch (error) {
    console.error('Error downloading file:', error);

    // Handle specific error cases
    if (error.code === 'NoSuchKey') {
      console.error('File not found in S3');
    } else if (error.code === 'AccessDenied') {
      console.error('Access denied - check your IAM permissions');
    } else if (error.code === 'NotSignedUp') {
      console.error('Identity not authorized - check your Identity Pool configuration');
    }

    throw error;
  }
}

// Alternative: Using async/await with error handling
async function downloadWithErrorHandling() {
  try {
    // Ensure credentials are loaded first
    await new Promise((resolve, reject) => {
      AWS.config.credentials.get((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log('Credentials loaded successfully');
    console.log('Identity ID:', AWS.config.credentials.identityId);

    // Now download the file
    const result = await downloadFileFromS3();
    return result;

  } catch (error) {
    console.error('Failed to download file:', error.message);
  }
}

// Usage - Run the download
(async () => {
  try {
    console.log('Starting download process...');
    await downloadWithErrorHandling();
    console.log('Process completed successfully!');
  } catch (error) {
    console.error('Process failed:', error);
  }
})();