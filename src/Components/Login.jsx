import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState("phone"); // "phone" | "otp" | "welcome"
  const [mobileNumber, setMobileNumber] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(20);
  const [canResend, setCanResend] = useState(false);
  const [name, setName] = useState("");
  const inputRefs = useRef([]);

  // Timer countdown for OTP
  useEffect(() => {
    if (step === "otp" && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [step, timer]);

  const handleContinue = (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Please agree to the Terms of Use & Privacy Policy");
      return;
    }
    const cleanNumber = mobileNumber.replace(/\D/g, "");
    if (cleanNumber.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setStep("otp");
    setOtp(["", "", "", "", "", ""]);
    setTimer(20);
    setCanResend(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      localStorage.setItem("isLoggedIn", "true");
      setStep("welcome");
    } else {
      alert("Please enter the complete 6-digit OTP");
    }
  };

  const handleResend = () => {
    if (canResend) {
      setTimer(20);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const handleWelcomeContinue = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem("userName", name.trim());
    }
    navigate("/wishlist");
  };

  const handleSkip = () => {
    navigate("/wishlist");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        {/* Discount Banner – hidden on welcome step */}
        {step !== "welcome" && (
          <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl p-4 sm:p-5 mb-6 text-center shadow-md">
            <div className="text-xl sm:text-2xl font-extrabold">FLAT + £300 OFF</div>
            <div className="text-xs sm:text-sm">ON YOUR 1ST ORDER</div>
            <div className="text-[10px] sm:text-xs opacity-80 mt-1">+ EXCITING OFFERS*</div>
            <div className="mt-2 bg-white/20 backdrop-blur-sm inline-block px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold">
              MYNTRA300
            </div>
          </div>
        )}

        {/* Login / OTP / Welcome Card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
          {step === "phone" && (
            <>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 sm:mb-6 text-center">
                Login or Signup
              </h1>
              <form onSubmit={handleContinue}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    <span className="text-gray-400">+91 |</span> Mobile Number*
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-base"
                    required
                  />
                </div>

                <div className="flex items-start gap-2 mb-6">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 flex-shrink-0"
                  />
                  <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    By continuing, I agree to the{" "}
                    <a href="#" className="text-indigo-600 hover:underline">
                      Terms of Use & Privacy Policy
                    </a>{" "}
                    and I am above 18 years old.
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200 text-sm sm:text-base"
                >
                  CONTINUE
                </button>
              </form>

              <div className="mt-4 text-center text-xs sm:text-sm">
                <span className="text-gray-500">Have trouble logging in? </span>
                <a href="#" className="text-indigo-600 hover:underline font-medium">
                  Get help
                </a>
              </div>
            </>
          )}

          {step === "otp" && (
            <>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 text-center">
                Verify with OTP
              </h1>
              <p className="text-gray-500 text-sm text-center mb-6">
                Sent to {mobileNumber}
              </p>

              <form onSubmit={handleVerify}>
                <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                <div className="text-center text-sm text-gray-500 mb-4">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Resend OTP
                    </button>
                  ) : (
                    <span>Resend OTP in: {String(timer).padStart(2, "0")}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200 text-sm sm:text-base"
                >
                  VERIFY
                </button>
              </form>

              <div className="mt-4 text-center">
                <Link
                  to="#"
                  className="text-indigo-600 hover:underline font-medium text-sm"
                >
                  Log in using Password
                </Link>
              </div>

              <div className="mt-3 text-center text-xs sm:text-sm">
                <span className="text-gray-500">Having trouble logging in? </span>
                <a href="#" className="text-indigo-600 hover:underline font-medium">
                  Get help
                </a>
              </div>
            </>
          )}

          {step === "welcome" && (
            <div className="text-center">
              <div className="text-5xl sm:text-6xl mb-4">👋</div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                Welcome to Myntra
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                Your account has been created
              </p>

              <form onSubmit={handleWelcomeContinue}>
                <div className="mb-4 text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    placeholder="Type your name (Optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition text-base"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 sm:py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition duration-200 text-sm sm:text-base"
                >
                  CONTINUE
                </button>
              </form>

              <div className="mt-4">
                <button
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-600 font-medium text-sm transition"
                >
                  SKIP
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;