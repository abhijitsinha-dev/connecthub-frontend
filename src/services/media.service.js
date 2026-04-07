import axios from 'axios';
import axiosClient from '../api/axiosClient';

const mediaApi = {
  getCloudinarySignature: async () => {
    return await axiosClient.get('/media/get-signature');
  },

  uploadToCloudinary: async (file, timestamp, signature) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('api_key', apiKey);
    formData.append('folder', 'connecthub');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    return response.data;
  },
};

export default mediaApi;
