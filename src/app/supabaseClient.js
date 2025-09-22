// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://orxbjfzrudpsdqoiolmri.supabase.co';
const supabaseKey = 'eyJhbGciOiJIjUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yeGJmenJ1ZHBzZHFvaW9sbXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NzkwNzEsImV4cCI6MjA3NDA1NTA3MX0.OZVNJgfdEazDB9H7XRgN4ESUs3XdX0k2uLKK-HOK1jc';

export const supabase = createClient(supabaseUrl, supabaseKey);