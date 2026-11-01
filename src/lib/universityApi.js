// src/lib/universityApi.js
import { Linking, Alert } from 'react-native';

// Curated map for direct SA University Application Portals (Fallback + Deep Links)
// An API gives you the homepage (e.g., uj.ac.za), but students need the exact application page.
const SA_APPLICATION_PORTALS = {
  "University of Johannesburg": "https://www.uj.ac.za/admission-aid/undergraduate/",
  "University of the Witwatersrand": "https://www.wits.ac.za/undergraduate/apply-to-wits/",
  "University of Pretoria": "https://www.up.ac.za/online-application",
  "University of Cape Town": "https://www.uct.ac.za/apply",
  "Stellenbosch University": "https://www.sun.ac.za/english/maties/apply",
  "University of KwaZulu-Natal": "https://caes.ukzn.ac.za/apply/",
  "Tshwane University of Technology": "https://www.tut.ac.za/study-at-tut/i-want-to-study/apply",
  "University of South Africa": "https://www.unisa.ac.za/sites/corporate/default/Apply-for-admission"
};

/**
 * Fetches official university website data restricted strictly to Universities in South Africa.
 * @param {string} universityName - E.g., "University of Johannesburg"
 */
export const fetchOfficialUniversityLink = async (universityName) => {
  try {
    // 1. Check our high-priority curated deep-link map first for instant resolution
    if (SA_APPLICATION_PORTALS[universityName]) {
      return {
        name: universityName,
        officialHomepage: SA_APPLICATION_PORTALS[universityName],
        applicationUrl: SA_APPLICATION_PORTALS[universityName],
        source: 'curated_portal'
      };
    }

    // 2. Query the Hipolabs Universities API (Strictly filtered to Universities & South Africa)
    const encodedName = encodeURIComponent(universityName);
    const apiUrl = `http://universities.hipolabs.com/search?name=${encodedName}&country=South+Africa`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      // Extract the first matched university's official web page
      const uni = data[0];
      const homepage = uni.web_pages && uni.web_pages.length > 0 ? uni.web_pages[0] : null;

      return {
        name: uni.name,
        officialHomepage: homepage,
        applicationUrl: homepage, // Falls back to official homepage if deep link isn't mapped
        domain: uni.domains ? uni.domains[0] : null,
        source: 'hipolabs_api'
      };
    }

    throw new Error('University not found in official registry.');
  } catch (error) {
    console.error('[UniversityAPI] Failed to resolve university URL:', error.message);
    return null;
  }
};

/**
 * Safely opens the resolved university portal in the mobile device's browser.
 */
export const redirectToUniversityPortal = async (universityName) => {
  const result = await fetchOfficialUniversityLink(universityName);

  if (!result || !result.applicationUrl) {
    Alert.alert(
      "Portal Unavailable",
      `Could not automatically resolve the official application portal for ${universityName}.`
    );
    return;
  }

  // Ensure URL uses HTTPS/HTTP protocol before handing off to OS Linking
  const targetUrl = result.applicationUrl.startsWith('http') 
    ? result.applicationUrl 
    : `https://${result.applicationUrl}`;

  const supported = await Linking.canOpenURL(targetUrl);
  if (supported) {
    await Linking.openURL(targetUrl);
  } else {
    Alert.alert("Error", `Your device cannot open this URL: ${targetUrl}`);
  }
};