// src/lib/scanStore.js
import { supabase } from './supabase';

export async function saveScan({ grades, imageUri = null, rawText = '', source = 'ocr' }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.warn('No active user session. Scan not saved to cloud.');
      return null;
    }

    const { data, error } = await supabase
      .from('scans')
      .insert([{
        user_id: session.user.id,
        grades,
        image_uri: imageUri,
        raw_text: rawText,
        source
      }])
      .select()
      .single();

    if (error) throw error;
    
    // Debug log to verify the URL was successfully written to the database
    console.log("Saved Scan Data - Image URI:", data.image_uri);
    
    return data;
  } catch (error) {
    console.error('Error saving scan to Supabase:', error);
    throw error;
  }
}

export async function fetchUserScans() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return [];

    const { data, error } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user scans:', error);
    return [];
  }
}

export async function deleteScan(scanId) {
  try {
    const { error } = await supabase
      .from('scans')
      .delete()
      .eq('id', scanId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting scan:', error);
    throw error;
  }
}
