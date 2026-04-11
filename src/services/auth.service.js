import axiosClient from '../api/axiosClient';

const authApi = {
  signup: async userData => {
    return await axiosClient.post('/auth/signup', userData);
  },

  signupVerifyEmail: async verificationData => {
    return await axiosClient.post(
      '/auth/signup/verify-email',
      verificationData
    );
  },

  login: async credentials => {
    return await axiosClient.post('/auth/login', credentials);
  },

  logout: async () => {
    return await axiosClient.post('/auth/logout');
  },

  me: async () => {
    return await axiosClient.get('/auth/me');
  },

  forgotPassword: async email => {
    return await axiosClient.post('/auth/forgot-password', { email });
  },

  forgotPasswordVerifyOtp: async verificationData => {
    return await axiosClient.post(
      '/auth/forgot-password/verify-otp',
      verificationData
    );
  },

  resetPassword: async resetData => {
    return await axiosClient.post('/auth/reset-password', resetData);
  },

  getCloudinarySignature: async () => {
    return await axiosClient.get('/media/get-signature');
  },

  emailChange: async emailData => {
    return await axiosClient.patch('/auth/email', emailData);
  },

  emailChangeVerifyOtp: async verificationData => {
    return await axiosClient.patch('/auth/email/verify-otp', verificationData);
  },

  updatePassword: async passwordData => {
    return await axiosClient.patch('/auth/password', passwordData);
  },
};

export default authApi;
