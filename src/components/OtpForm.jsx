import { useState } from 'react';
import { BiArrowBack, BiSolidMessageRoundedDetail } from 'react-icons/bi';
import Button from './Button';

const OtpForm = ({ email, onSubmitOtp, onBack }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const value = e.target.value;
    // only allow numbers and restrict to 6 digits max
    if (value === '' || (/^[0-9\b]+$/.test(value) && value.length <= 6)) {
      setOtp(value);
      if (error) setError('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmitOtp(otp);
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="animate-fade-in">
      <h1 className="text-[32px] mb-2 font-semibold text-text-primary">
        Enter OTP
      </h1>
      <p className="text-[14.5px] text-text-secondary mb-8 leading-relaxed">
        We've sent a 6-digit verification code to
        <br />
        <span className="font-semibold text-brand-primary">{email}</span>
      </p>

      <div className="relative my-6">
        <input
          type="text"
          name="otp"
          value={otp}
          onChange={handleChange}
          maxLength={6}
          placeholder="OTP"
          className={`w-full px-5 py-3.25 pr-12.5 bg-bg-secondary rounded-lg outline-none text-[16px] text-text-primary font-medium placeholder:text-text-secondary placeholder:font-normal transition-all text-center tracking-[0.5em] ${
            error
              ? 'border-2 border-red-500'
              : 'border-2 border-transparent focus:border-brand-primary'
          }`}
        />
        <BiSolidMessageRoundedDetail className="absolute right-5 top-1/2 -translate-y-1/2 text-[20px] text-text-secondary" />
        {error && (
          <p className="text-red-500 text-[12px] absolute -bottom-5 left-2 m-0 text-left w-full">
            {error}
          </p>
        )}
      </div>

      <Button type="submit" className="mt-2" disabled={isSubmitting}>
        {isSubmitting ? 'Verifying...' : 'Verify OTP'}
      </Button>

      <div className="mt-6 text-text-primary">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-2 w-full bg-transparent border-none cursor-pointer text-[14.5px] text-text-secondary hover:text-brand-primary transition-colors font-medium"
          disabled={isSubmitting}
        >
          <BiArrowBack className="text-[18px]" />
          Back
        </button>
      </div>
    </form>
  );
};

export default OtpForm;
