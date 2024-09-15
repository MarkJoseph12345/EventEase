import { useState } from 'react';
import { sendPasswordResetEmail, verifyToken, resetPassword } from '@/utils/apiCalls';

interface ForgotPasswordPopupProps {
  onClose: () => void;
}

const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();
  const [step, setStep] = useState<'sendEmail' | 'verifyToken' | 'resetPassword'>('sendEmail');
  const [token, setToken] = useState('');
  const [tokenVerified, setTokenVerified] = useState("");
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = await sendPasswordResetEmail(email);
    setLoading(false);
    if (result.startsWith("Email has been send!")) {
      setMessage('Password reset email sent successfully. Please check your email for a 6-digit token.');
      setStep('verifyToken');
      setEmail('');
    } else if (result.startsWith(`{"messages":"User with that email not Found!"}`)) {
      setMessage("User with that email not Found!");
    } else if (result.startsWith(`{"messages":"Token Already Sent`)) {
      setMessage('Token Already Sent');
      setStep('verifyToken');
      setEmail('');
    }
  };


  const handleTokenSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = await verifyToken(token);
    setLoading(false);

    if (result) {
      setMessage('Token verified successfully. You can now set a new password.');
      setTokenVerified(token);
      setStep('resetPassword');
      setToken('');
    } else {
      setMessage('Invalid token. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);

    const result = await resetPassword(tokenVerified, newPassword);
    setLoading(false);

    if (result) {
      setMessage('Password has been reset successfully.');
      setStep('sendEmail');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } else {
      setMessage('Failed to reset password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Forgot Password</h2>
        {step === 'sendEmail' && (
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
        )}

        {step === 'verifyToken' && (
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

        {step === 'resetPassword' && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-semibold mb-1">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            {message && <p className="text-sm mb-4">{message}</p>}
            <button type="submit" className="bg-customYellow py-2 px-4 rounded mr-2" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button type="button" onClick={() => setStep('verifyToken')} className="py-2 px-4 rounded border">
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;
