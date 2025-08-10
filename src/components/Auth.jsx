import { supabase } from '../supabase/supabase';
import { Button } from 'antd';

export default function Auth() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    });
    if (error) console.error(error);
  };

  return (
    <Button type="primary" onClick={handleLogin}>
      Login with Google
    </Button>
  );
}