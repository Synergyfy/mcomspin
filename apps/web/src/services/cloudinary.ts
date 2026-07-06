export async function uploadToCloudinary(file: File, folder: string = 'campaigns'): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

  if (!cloudName || !apiKey) {
    throw new Error('Cloudinary environment variables missing');
  }

  const timestamp = Math.round(new Date().getTime() / 1000).toString();

  const paramsToSign = {
    timestamp,
    folder,
  };

  // 1. Get the signature from our secure backend API route
  const res = await fetch('/api/cloudinary/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paramsToSign }),
  });

  if (!res.ok) {
    throw new Error('Failed to get secure upload signature');
  }

  const { signature } = await res.json();

  // 2. Upload directly to Cloudinary using the secure signature
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', folder);

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json();
    throw new Error(err.error?.message || 'Failed to upload image to Cloudinary');
  }

  const data = await uploadRes.json();
  return data.secure_url;
}
