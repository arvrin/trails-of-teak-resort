'use client';

import { useEffect, useState } from 'react';
import { authHelpers, database } from '@/lib/supabase';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDebug = async () => {
      const debug: any = {};
      
      try {
        // Step 1: Check auth user
        console.log('Step 1: Getting current auth user...');
        const authUser = await authHelpers.getCurrentUser();
        debug.authUser = authUser ? {
          id: authUser.id,
          email: authUser.email,
          created_at: authUser.created_at
        } : null;
        console.log('Auth user:', debug.authUser);

        if (authUser) {
          // Step 2: Try to get user profile
          console.log('Step 2: Getting user profile...');
          try {
            const { data: userProfile, error: userError } = await database.getUser(authUser.id);
            debug.userProfile = userProfile;
            debug.userError = userError;
            console.log('User profile:', userProfile);
            console.log('User error:', userError);
          } catch (err) {
            debug.userProfileException = err;
            console.error('Exception getting user profile:', err);
          }

          // Step 3: Try direct Supabase query
          console.log('Step 3: Direct Supabase query...');
          try {
            const { supabase } = await import('@/lib/supabase');
            const { data: directData, error: directError } = await supabase
              .from('users')
              .select('*')
              .eq('id', authUser.id)
              .single();
            debug.directQuery = directData;
            debug.directError = directError;
            console.log('Direct query result:', directData);
            console.log('Direct query error:', directError);
          } catch (err) {
            debug.directException = err;
            console.error('Direct query exception:', err);
          }

          // Step 4: Check session
          console.log('Step 4: Getting session...');
          const session = await authHelpers.getCurrentSession();
          debug.session = session ? {
            access_token: session.access_token ? 'exists' : 'missing',
            user_id: session.user?.id
          } : null;
          console.log('Session:', debug.session);
        }

      } catch (err) {
        debug.mainException = err;
        console.error('Main exception:', err);
      }

      setDebugInfo(debug);
      setLoading(false);
    };

    runDebug();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Debug Authentication</h1>
          <p>Loading debug information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Debug Authentication</h1>
        
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold text-lg mb-2">Auth User</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.authUser, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold text-lg mb-2">User Profile</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.userProfile, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold text-lg mb-2">User Profile Error</h2>
            <pre className="text-sm bg-red-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.userError, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold text-lg mb-2">Direct Query Result</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.directQuery, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibont text-lg mb-2">Direct Query Error</h2>
            <pre className="text-sm bg-red-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.directError, null, 2)}
            </pre>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h2 className="font-semibold text-lg mb-2">Session Info</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(debugInfo.session, null, 2)}
            </pre>
          </div>

          {debugInfo.userProfileException && (
            <div className="bg-white p-4 rounded-lg border">
              <h2 className="font-semibold text-lg mb-2">User Profile Exception</h2>
              <pre className="text-sm bg-red-100 p-2 rounded overflow-auto">
                {debugInfo.userProfileException.toString()}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}