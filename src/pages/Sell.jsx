import { useState } from 'react';
import { supabase } from '../supabase/supabase';
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

export default function PrivateImageUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [signedUrl, setSignedUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    console.log("===working")
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `private-uploads/${Date.now()}.${fileExt}`;

      console.log(fileName,"===filename")
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-images')  
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('car-images')
        .createSignedUrl(uploadData.path, 60 * 60);  

      if (urlError) throw urlError;

      setSignedUrl(signedUrlData.signedUrl);
      alert('File uploaded securely! Signed URL generated.');
      
    } catch (error) {
      console.error('Error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h2>Upload Image</h2>
      
      <div style={{ margin: '20px 0' }}>
        <input 
          type="file"
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>
      
      <Button
        type="primary"
        icon={<UploadOutlined />}
        onClick={handleSubmit}
        loading={loading}
        disabled={!file}
      >
        {loading ? 'Uploading...' : 'Upload Securely'}
      </Button>

      {signedUrl && (
        <div style={{ marginTop: '20px' }}>
          <h4>Secure Access Link (expires in 1 hour):</h4>
          <a 
            href={signedUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ wordBreak: 'break-all' }}
          >
            {signedUrl}
          </a>
        </div>
      )}
    </div>
  );
}