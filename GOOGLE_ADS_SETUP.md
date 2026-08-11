# Google Ads Conversion Tracking - Setup Guide

## ✅ What Has Been Implemented

I've successfully implemented a complete booking confirmation page with Google Ads conversion tracking. Here's what's been done:

### 1. **New Booking Confirmation Page**
- Created: `/src/pages/landing/booking/Success.tsx`
- Route: `/booking/success`
- Full URL will be: `https://[your-domain]/booking/success`

### 2. **Features Implemented**
- ✅ Dedicated success/confirmation page
- ✅ Automatic redirection after successful booking payment
- ✅ Google Ads conversion tracking integration
- ✅ Facebook Pixel conversion tracking (already working)
- ✅ Displays booking confirmation details:
  - Booking reference number
  - Customer email confirmation
  - SMS notification confirmation
  - Important reminders
  - Contact information
- ✅ Bilingual support (English/French)
- ✅ Navigation buttons (Back to Home, New Booking)

### 3. **Tracking Implementation**
- Google Ads global site tag (gtag.js) added to `index.html`
- Conversion event triggers on success page load
- Sends booking value and transaction ID to Google Ads
- Facebook Pixel also updated to send proper conversion data

## 🔧 Configuration Required

To activate Google Ads tracking, you need to add these environment variables to your `.env` file:

### Step 1: Get Your Google Ads Credentials

1. **Login to Google Ads**: https://ads.google.com
2. **Navigate to**: Tools & Settings (⚙️) → Measurement → Conversions
3. **Create or Select a Conversion Action** for "Booking Completed"
4. **Get the following values**:

### Step 2: Add to .env File

Create or update your `.env` file in the project root with these variables:

```bash
# Google Ads Configuration
VITE_GOOGLE_ADS_ID=AW-XXXXXXXXXX
VITE_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXXXX
VITE_GOOGLE_ADS_CONVERSION_LABEL=XXXXXXXXXXXXX
```

**Where to find these values:**

- **VITE_GOOGLE_ADS_ID**: Your Google Ads account ID (format: `AW-1234567890`)
  - Found in: Google Ads → Tools → Conversions → Global site tag section
  
- **VITE_GOOGLE_ADS_CONVERSION_ID**: Same as VITE_GOOGLE_ADS_ID (format: `AW-1234567890`)
  - This is typically the same as your Ads ID
  
- **VITE_GOOGLE_ADS_CONVERSION_LABEL**: Unique label for this conversion action
  - Found in: Google Ads → Tools → Conversions → Event snippet section
  - Format: looks like `abc123DEF456`

### Step 3: Example Configuration

Your conversion tracking code from Google Ads looks like this:

```javascript
gtag('event', 'conversion', {
    'send_to': 'AW-123456789/AbC-dEfGhIjK',
    'value': 1.0,
    'currency': 'CAD'
});
```

Then your .env should be:

```bash
VITE_GOOGLE_ADS_ID=AW-123456789
VITE_GOOGLE_ADS_CONVERSION_ID=AW-123456789
VITE_GOOGLE_ADS_CONVERSION_LABEL=AbC-dEfGhIjK
```

## 📋 Setting Up Google Ads Conversion Action

If you haven't created a conversion action yet:

1. **Go to Google Ads**: https://ads.google.com
2. **Click**: Tools & Settings (⚙️) → Measurement → Conversions
3. **Click**: "+ New conversion action"
4. **Select**: Website
5. **Choose**: "Use Google Tag Manager, a CMS, or manually add the code"
6. **Configure**:
   - Conversion name: `Booking Completed` or `Réservation Confirmée`
   - Goal and action optimization: `Purchase`
   - Value: `Use different values for each conversion`
   - Count: `Every`
   - Click-through conversion window: `30 days` (recommended)
   - View-through conversion window: `1 day`
7. **Click**: Create and Continue
8. **Copy the values** from the code snippet provided

## 🧪 Testing

### Test the Implementation:

1. **Start your dev server**: `npm run dev`
2. **Complete a test booking** through the booking flow
3. **After successful payment**, you should be redirected to `/booking/success`
4. **Check browser console** (F12) to verify gtag events are firing
5. **In Google Ads**: Go to Conversions → View conversion details
   - It may take 24-48 hours for test conversions to appear

### Verify Tracking is Working:

Open browser console (F12) on the success page and type:
```javascript
dataLayer
```
You should see conversion events logged there.

## 📊 What Data is Tracked

When a booking is confirmed, the following data is sent to Google Ads:

- **Event**: `conversion`
- **Conversion ID**: Your Google Ads conversion tracking ID
- **Value**: Total booking amount (deposit paid)
- **Currency**: `CAD`
- **Transaction ID**: Booking reference number (for deduplication)

## 🌐 URL for Google Ads Configuration

**Confirmation Page URL**: `https://[your-domain]/booking/success`

Use this URL when setting up:
- Conversion tracking
- Remarketing audiences
- Campaign landing page tracking

## 📝 Additional Notes

- The tracking script **only loads if** environment variables are configured
- If variables are missing, the app continues to work normally without Google Ads tracking
- Facebook Pixel tracking continues to work as before (ID: 1543592993836067)
- The confirmation page receives booking data via URL parameters:
  - `?id=123` - Booking ID
  - `&email=customer@example.com` - Customer email
  - `&total=100.00` - Total amount paid

## 🆘 Troubleshooting

**Problem**: Conversions not showing in Google Ads

**Solutions**:
1. Verify `.env` file has correct values
2. Restart dev server after adding env variables
3. Clear browser cache
4. Wait 24-48 hours for data to appear in Google Ads dashboard
5. Use [Google Tag Assistant](https://tagassistant.google.com/) Chrome extension to debug

**Problem**: Getting "gtag is not defined" error

**Solution**: Ensure `VITE_GOOGLE_ADS_ID` is correctly set in `.env` file

## 📞 Next Steps

1. ✅ Code implementation is complete
2. ⏳ Add Google Ads credentials to `.env` file
3. ⏳ Deploy to production
4. ⏳ Test with a real booking
5. ⏳ Verify conversions appear in Google Ads dashboard (24-48h delay)
6. ✅ Configure your Google Ads campaigns to optimize for conversions

---

**Implementation completed on**: 2026-08-11
**Confirmation page URL**: `/booking/success`
**Status**: ✅ Ready for configuration
