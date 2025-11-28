# Google Places API Key Setup Instructions

⚠️ **SECURITY ALERT**: Never commit your API key to public repositories! Always use environment variables.

## Step 1: Enable Required APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one
4. Click on "APIs & Services" > "Library" in the left sidebar

5. **Enable Maps JavaScript API** (REQUIRED):
   - Search for "Maps JavaScript API" and click on it
   - Click "Enable" to enable the Maps JavaScript API for your project
   - This API is required for the autocomplete to work

6. **Enable Places API** (REQUIRED):
   - Search for "Places API" and click on it
   - Click "Enable" to enable the Places API for your project
   - This API provides the address autocomplete suggestions

## Step 2: Create API Key

1. Go to "APIs & Services" > "Credentials" in the left sidebar
2. Click "Create Credentials" > "API Key"
3. Your API key will be generated. **Copy this key** - you'll need it in the next step.

## Step 3: Restrict Your API Key (Recommended for Security)

1. Click on your newly created API key to edit it
2. Under "API restrictions", select "Restrict key"
3. **Select both APIs from the list**:
   - Maps JavaScript API
   - Places API
4. Under "Application restrictions", you can:
   - Select "HTTP referrers (web sites)" 
   - Add your website domains (e.g., `homesellerinformation.netlify.app`, `*.netlify.app`)
5. Click "Save"

## Step 4: Add API Key to Your Project (Using Environment Variables)

**IMPORTANT**: The API key is now loaded dynamically from environment variables for security. The key is no longer hardcoded in `index.html`.

1. Create a `.env` file in your project root (if it doesn't exist):
   ```bash
   touch .env
   ```

2. Add your API key to the `.env` file:
   ```
   VITE_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
   ```

3. **IMPORTANT**: The `.env` file is already in `.gitignore`, so it won't be committed to git.

4. For production (Netlify), add the environment variable in your Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add `VITE_GOOGLE_PLACES_API_KEY` with your API key value
   - Redeploy your site after adding the variable

## Step 5: Test the Autocomplete

1. Start your development server: `npm run dev`
2. Navigate to the contact form
3. Click on the "Property Address" field
4. Start typing an address - you should see Google Places autocomplete suggestions appear

## Important Notes - Pricing Information

### Is it Free?

**Yes, for most use cases!** Google Places API is not completely free, but Google provides a **$200 monthly credit** to all users. This credit typically covers:

- **~70,000 Autocomplete requests per month** (which is what we're using)
- For a typical real estate website, this is usually more than enough

### Pricing Details

- **Free Tier**: $200/month credit (covers ~70,000 Autocomplete requests)
- **After Free Tier**: $2.83 per 1,000 Autocomplete requests
- **Billing Required**: You must enable billing in Google Cloud Console, but you won't be charged unless you exceed the $200 credit

### For Your Use Case

If you get 100 form submissions per month, and each user types an average of 5 autocomplete requests, that's only 500 requests/month - well within the free tier!

### Security

- Always restrict your API key to prevent unauthorized use
- Set up API key restrictions (see Step 3)
- Monitor your usage in Google Cloud Console to stay within the free tier

## Troubleshooting

### Common Errors

**"ApiNotActivatedMapError"**:
- This means the **Maps JavaScript API** is not enabled
- Go to Google Cloud Console → APIs & Services → Library
- Search for "Maps JavaScript API" and click "Enable"
- Wait a few minutes for the API to activate, then refresh your page

**"ApiNotActivatedMapError" for Places**:
- Make sure both **Maps JavaScript API** and **Places API** are enabled
- Both APIs are required for the autocomplete feature to work

**Other Issues**:
- If autocomplete doesn't work, check the browser console for errors
- Make sure both Maps JavaScript API and Places API are enabled in your Google Cloud project
- Verify your API key restrictions allow your domain
- Check that billing is enabled if you've exceeded the free tier
- Wait a few minutes after enabling APIs for them to become active

## If Your API Key Was Compromised

If you received a security alert from Google about your API key being publicly accessible:

1. **Immediately regenerate your API key**:
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Find your compromised API key
   - Click "Regenerate key" to create a new one
   - Update your `.env` file with the new key

2. **Add proper restrictions** (see Step 3 above)

3. **Remove the old key from your code**:
   - The code now uses environment variables, so your key is no longer in the repository
   - Make sure your `.env` file is in `.gitignore` (it already is)

4. **Monitor usage** in Google Cloud Console to ensure no unauthorized usage

