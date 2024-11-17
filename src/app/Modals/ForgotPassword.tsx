import { useState } from 'react';
import { sendPasswordResetEmail, verifyToken, resetPassword } from '@/utils/apiCalls';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PopUps from './PopUps';

interface ForgotPasswordPopupProps {
  onClose: () => void;
}

const ForgotPasswordPopup: React.FC<ForgotPasswordPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | undefined>()
  const [step, setStep] = useState<'sendEmail' | 'verifyToken' | 'resetPassword'>('sendEmail');
  const [token, setToken] = useState('');
  const [tokenVerified, setTokenVerified] = useState("");
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const result = await sendPasswordResetEmail(email);
    setLoading(false);
    const { messages } = result;
    console.log(messages)
    console.log((messages === undefined))
    if (messages === undefined) {
      setMessage({ text: "Password reset email sent successfully. Please check your email for a 6-digit token.", type: "success" });
      setStep('verifyToken');
      setEmail('');
    } else if (messages === `User with that email not Found!`) {
      setMessage({ text: "User with that email not found!", type: "error" });
    } else if (messages === "Token already sent") {
      setMessage({ text: "Token Already Sent", type: "error" });
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
      setMessage({ text: "Token verified successfully. You can now set a new password.", type: "success" });
      setTokenVerified(token);
      setStep('resetPassword');
      setToken('');
    } else {
      setMessage({ text: "Invalid token. Please try again.", type: "error" });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validatePassword(newPassword)) {
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match. Please try again.", type: "error" });
      return;
    }
    setLoading(true);

    const result = await resetPassword(tokenVerified, newPassword);
    setLoading(false);

    if (result) {
      setMessage({ text: "Password has been reset successfully.", type: "success" });
      setStep('sendEmail');
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } else {
      setMessage({ text: "Failed to reset password.", type: "error" });
    }
  };

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])?[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

    if (!passwordRegex.test(password)) {
      setMessage({ text: "Your password must be 8 characters with at least one uppercase letter and one number.", type: "error" });
      return true;
    }
    else return false;
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center px-10 ">
      <div className="bg-white pb-6 rounded shadow-lg smartphone:w-9/12 tablet:w-[34.125rem] mx-auto">
        <div className="bg-black w-full">
          <h2 className="text-lg font-bold mb-4 text-customYellow px-1">Forgot Password</h2>
        </div>
        <div className="px-6">
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
              <div className="mb-4 ">
                <label htmlFor="newPassword" className="block text-sm font-semibold mb-1">New Password</label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <button tabIndex={-1} type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </div>
              <div className="mb-4 relative">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                  <button tabIndex={-1} type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-1/2 transform -translate-y-1/2 mr-2">
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                </div>
              </div>
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
      {message && <PopUps message={message} onClose={() => setMessage(undefined)} />}
    </div>
  );
};

export default ForgotPasswordPopup;
