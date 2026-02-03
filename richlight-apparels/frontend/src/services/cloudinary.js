// Cloudinary Configuration
// In Dashboard: Settings → Upload → Add upload preset → set to "Unsigned" and use same name below
export const CLOUDINARY_CLOUD_NAME = "dbyblpcow";
export const CLOUDINARY_UPLOAD_PRESET = "richlight_preset"; // Must be an *Unsigned* preset in Cloudinary

// Upload Image to Cloudinary (returns { url, publicId } or throws with message)
export const uploadImage = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!validImageTypes.includes(file.type)) {
    throw new Error('Invalid file type. Use JPEG, PNG, GIF or WebP.');
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 10MB.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const msg = data?.error?.message || `Upload failed (${response.status})`;
      throw new Error(msg);
    }

    if (data.error) {
      throw new Error(data.error.message || 'Upload failed');
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      format: data.format,
    };
  } catch (err) {
    if (err instanceof Error && (err.message.startsWith('Invalid') || err.message.startsWith('File') || err.message.startsWith('No file'))) {
      throw err;
    }
    const message = err instanceof Error ? err.message : 'Upload failed. Check Cloudinary preset is Unsigned.';
    throw new Error(message);
  }
};

// Upload Video to Cloudinary
export const uploadVideo = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  if (!validVideoTypes.includes(file.type)) {
    throw new Error('Invalid file type. Use MP4, WebM or QuickTime.');
  }

  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    throw new Error('File too large. Maximum size is 100MB.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const msg = data?.error?.message || `Upload failed (${response.status})`;
      throw new Error(msg);
    }

    if (data.error) {
      throw new Error(data.error.message || 'Upload failed');
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      duration: data.duration,
      format: data.format,
    };
  } catch (err) {
    throw err instanceof Error ? err : new Error('Video upload failed. Check Cloudinary preset is Unsigned.');
  }
};

export const deleteImage = async (publicId) => {
  console.log('Delete requires backend implementation:', publicId);
  return false;
};

export const getOptimizedImageUrl = (publicId, options = {}) => {
  const {
    width = 'auto',
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${width},q_${quality},f_${format},c_${crop}/${publicId}`;
};

export const getThumbnailUrl = (publicId, size = 200) => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/w_${size},h_${size},c_fill,g_auto/${publicId}`;
};
