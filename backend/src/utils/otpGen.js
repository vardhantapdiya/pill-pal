function generateOtp(length = parseInt(process.env.OTP_LENGTH || "6", 10)) {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10); // numeric OTP
  }
  return code;
}

module.exports = { generateOtp };