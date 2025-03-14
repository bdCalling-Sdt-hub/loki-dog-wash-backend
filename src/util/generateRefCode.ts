export const generateReferralCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let referralCode = '';
    
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      referralCode += chars[randomIndex];
    }
    
    return referralCode;
  };
  
  const referralCode = generateReferralCode();
  console.log(referralCode);
  