import { useState } from 'react';
import { sendPasswordResetEmail } from '@/utils/apiCalls';

interface ForgotPasswordPopupProps {
  onClose: () => void;
}

const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [step, setStep] = useState<'sendEmail' | 'verifyToken'>('sendEmail');
  const [token, setToken] = useState('');
  const [tokenVerified, setTokenVerified] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = await sendPasswordResetEmail(email);
    setLoading(false);

    if (result) {
      setMessage('Password reset email sent successfully. Please check your email for a 6-digit token.');
      setStep('verifyToken');
      setEmail(''); // Clear email field
    } else {
      setMessage('Failed to send password reset email.');
    }
  };

  const handleTokenSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

   // const result = await verifyToken(token); 
    setLoading(false);

    // if (result) {
    //   setMessage('Token verified successfully. You can now reset your password.');
    //   setTokenVerified(true);
    // } else {
    //   setMessage('Invalid token. Please try again.');
    // }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Forgot Password</h2>
        {step === 'sendEmail' ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            {message && <p className="text-sm mb-4">{message}</p>}
            <button type="submit" className="bg-customYellow py-2 px-4 rounded mr-2" disabled={loading}>
              {loading ? 'Sending...' : 'Send Email'}
            </button>
            <button type="button" onClick={onClose} className="py-2 px-4 rounded border">
              Close
            </button>
          </form>
        ) : (
          <form onSubmit={handleTokenSubmit}>
            <div className="mb-4">
              <label htmlFor="token" className="block text-sm font-semibold mb-1">Enter 6-Digit Token</label>
              <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full border rounded px-3 py-2"
                maxLength={6}
                required
              />
            </div>
            {message && <p className="text-sm mb-4">{message}</p>}
            <button type="submit" className="bg-customYellow py-2 px-4 rounded mr-2" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify Token'}
            </button>
            <button type="button" onClick={() => setStep('sendEmail')} className="py-2 px-4 rounded border">
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;
