// Function to extract the expiration time from the token
export const getTokenExpirationTime = (token) => {
    if (!token) {
      return 0; // Return 0 if the token is not provided or invalid
    }
  
    // Split the token into its three parts: header, payload, and signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      return 0; // Return 0 if the token is not in the expected format
    }
  
    // Extract the payload part and decode it
    const payloadBase64 = parts[1];
    const payload = atob(payloadBase64);
  
    // Parse the decoded payload as JSON
    const payloadData = JSON.parse(payload);
  
    // Check if the payload contains the expiration claim (exp)
    if (payloadData.exp) {
      // Convert the expiration claim to milliseconds and return it
      return payloadData.exp * 1000;
    } else {
      return 0; // Return 0 if the expiration claim is missing
    }
  };
  
  // Rest of your utility functions or exports...
  