'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDebug = async () => {
      const debug: any = {};
      
      // Check environment variables
      debug.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      debug.hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      debug.anonKeyLength = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0;
      
      // Test Supabase connection
      try {
        const { data, error } = await supabase.auth.getSession();
        debug.sessionTest = { success: !error, error: error?.message };
      } catch (err) {
        debug.sessionTest = { success: false, error: String(err) };
      }
      
      // Test sign in
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'testpassword'
        });
        debug.signInTest = { 
          success: !error, 
          error: error?.message,
          user: data.user?.id ? 'User object received' : 'No user'
        };
      } catch (err) {
        debug.signInTest = { success: false, error: String(err) };
      }
      
      setDebugInfo(debug);
      setLoading(false);
    };
    
    runDebug();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Running authentication diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Debug Report</h1>
        
        <div className="grid gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
            <div className="space-y-2">
              <p><strong>Supabase URL:</strong> {debugInfo.supabaseUrl || 'NOT SET'}</p>
              <p><strong>Has Anon Key:</strong> {debugInfo.hasAnonKey ? 'YES' : 'NO'}</p>
              <p><strong>Anon Key Length:</strong> {debugInfo.anonKeyLength} characters</p>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow ${debugInfo.sessionTest?.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className="text-xl font-semibold mb-4">Supabase Connection Test</h2>
            <p><strong>Status:</strong> {debugInfo.sessionTest?.success ? 'SUCCESS' : 'FAILED'}</p>
            {debugInfo.sessionTest?.error && (
              <p><strong>Error:</strong> {debugInfo.sessionTest.error}</p>
            )}
          </div>

          <div className={`p-6 rounded-lg shadow ${debugInfo.signInTest?.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <h2 className="text-xl font-semibold mb-4">Sign In Test</h2>
            <p><strong>Status:</strong> {debugInfo.signInTest?.success ? 'SUCCESS' : 'FAILED'}</p>
            <p><strong>User:</strong> {debugInfo.signInTest?.user || 'None'}</p>
            {debugInfo.signInTest?.error && (
              <p><strong>Error:</strong> {debugInfo.signInTest.error}</p>
            )}
          </div>

          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Fix Instructions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">1. Check Vercel Environment Variables</h3>
                <p>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</p>
                <p>Ensure these are set for Production:</p>
                <code className="block bg-gray-100 p-2 rounded mt-2">
                  NEXT_PUBLIC_SUPABASE_URL=https://ypalglrgqjkcufyqepjo.supabase.co<br/>
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                </code>
              </div>
              
              <div>
                <h3 className="font-semibold">2. Update Supabase Auth Settings</h3>
                <p>In Supabase Dashboard → Authentication → Settings:</p>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Site URL: Add your Vercel deployment URL</li>
                  <li>Redirect URLs: Add https://your-app.vercel.app/**</li>
                  <li>Disable email confirmation temporarily</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold">3. Create Test Admin User</h3>
                <p>Run this SQL in Supabase SQL Editor:</p>
                <code className="block bg-gray-100 p-2 rounded mt-2 text-sm">
                  INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at, updated_at)<br/>
                  VALUES (gen_random_uuid(), 'admin@trailsofteak.com', crypt('admin123', gen_salt('bf')), now(), '{&quot;role&quot;:&quot;admin&quot;,&quot;full_name&quot;:&quot;Admin User&quot;}', now(), now());
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}