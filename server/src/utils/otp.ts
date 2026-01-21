import crypto from "crypto";
import nodemailer from "nodemailer";

export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const hashOTP = (otp: string): string => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};

export const verifyOTP = (plainOTP: string, hashedOTP: string): boolean => {
  const hash = crypto.createHash("sha256").update(plainOTP).digest("hex");
  return hash === hashedOTP;
};

export const sendOTPEmail = async (
  email: string,
  otp: string,
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Login OTP",
    // text: `Your OTP for login is: ${otp}. It is valid for 10 minutes.`,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Premium Service Update</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td, a { font-family: 'Segoe UI', Arial, sans-serif !important; }
    </style>
    <![endif]-->
    <style>
/* Base styles */
body {
    margin: 0;
    padding: 0;
    width: 100% !important;
    background-color: #FFFFFF;
    font-family: Arial, Helvetica, sans-serif;
    -webkit-font-smoothing: antialiased;
}
/* a{
    color: red;
    background-color:rgb(136, 20, 20);
} */
table {
    border-collapse: collapse;
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
}
img {
    border: 0;
    outline: none;
    text-decoration: none;
    -ms-interpolation-mode: bicubic;
}
/* Layout Containers */
.wrapper {
    width: 100%;
    table-layout: fixed;
    background-color: #F3F4F6;
    padding: 2.5rem 0;
}
.container {
    width: 37.5rem;
    margin: 0 auto;
    background-color: #FFFFFF;
    border-radius: 1.5rem;
    overflow: hidden;
    box-shadow:
        0 1.25rem 1.5625rem -0.3125rem rgba(0, 0, 0, 0.04),
        0 0.625rem 0.625rem -0.3125rem rgba(0, 0, 0, 0.02);
}
/* Typography */
.h1 {
    color: #111827;
    font-size: 1.5625rem;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 0.625rem 0;
    letter-spacing: -0.025em;
    font-family: Arial, Helvetica, sans-serif;
}
.p {
    color: #3B4450;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
}
/* Button */
.btn-primary {
    background-color: #154069;
    color: #FFFFFF !important;
    padding: 0.625rem 1.625rem;
    text-decoration: none;
    border-radius: 0.75rem;
    font-weight: 600;
    font-size: 1rem;
    display: inline-block;
    justify-content: center;
    margin: 2rem ;
}
/* Sections */
.header {
    padding: 1.875rem 1.25rem 0;
    text-align: center;
}
.header .logo {
    width: 30vh;
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0 auto;
}
.header h2 {
    padding-bottom: 1.625rem;
    margin-top: 0;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 400;
    font-size: larger;
}
.content {
    padding: 0 2.5rem;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
}
/* App Download Section */
.app-drawer {
    background-color: #FFFFFF;
    padding: 1.25rem 2.5rem;
    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
}
.app-badge {
    height: 3.75rem;
    margin: 0.125rem;
    vertical-align: middle;
    transition: transform 0.2s;
}
/* Footer */
.footer {
    padding: 3rem 2.5rem;
    margin: 0.9375rem 0;
    text-align: center;
}
.social-app {
    margin: 1.25rem 1.25rem 0;
}
.social-icon {
    display: inline-block;
    margin: 0.375rem 0.5rem;
}
.social-icon img {
    width: 2rem;
    height: 2rem;
}
.line {
    width: 60%;
    height: 0.0625rem;
    background: #000;
}
.legal-text {
    color: #262D39;
    font-size: 0.875rem;
    line-height: 1.8;
}
/* Responsive */
@media screen and (max-width: 37.5rem) {
    .container {
        width: 100% !important;
        border-radius: 0 !important;
    }
    .h1 {
        font-size: 1.625rem !important;
    }
    .header,
    .content,
    .app-drawer {
        padding: 2rem 1.5rem !important;
    }
}
</style>
</head>
<body>
    <div class="wrapper">
        <center>
            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center">
                        <div class="container">
                            <!-- HEADER -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="header">
                                        <img src="./mypalika.png" alt="Logo" class="logo">
                                       <h2>Service Delivery Municipality App</h2>
                                    </td>
                                </tr>
                            </table>
                            <!-- BODY -->
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td class="content">
                                        <h1 class="h1">Experience a more intelligent way to work.</h1>
                                        <p class="p">Welcome to the premium tier of your productivity suite. We've refined every interaction to ensure that your focus remains on high-impact tasks, while we handle the complexity in the background.</p>
                                        <div class="btn-wrapper">
                                            <a href="https://demo.palikaportal.com/" class="btn-primary" title="Launch Dashboard" target="_blank">Go to My Palika</a>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <table width="100%" border="0" cellpadding="0" cellspacing="0">
    <!-- Line -->
    <tr>
        <td style="padding: 16px 0;">
            <hr class="line" style=" border:none; height:1px; background:#000; width:60%;">
        </td>
    </tr>
    <!-- Social Links -->
    <tr>
        <td align="center" class="social-app" style="padding: 16px 0;">
            <p style="margin:0; color:#111827; font-size:0.9375rem; font-weight:500;">Stay Connected With Us</p>
            <!-- <a href="#" class="social-icon" title="Facebook" target="_blank"><img src="https://img.icons8.com/?size=100&id=118497&format=png&color=000000" alt="Facebook"></a>
            <a href="#" class="social-icon" title="LinkedIn" target="_blank"><img src="https://img.icons8.com/?size=100&id=13930&format=png&color=000000" alt="LinkedIn"></a>
            <a href="#" class="social-icon" title="Instagram" target="_blank"><img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" alt="Instagram"></a>
            <a href="#" class="social-icon" title="Twitter" target="_blank"><img src="https://img.icons8.com/?size=100&id=ClbD5JTFM7FA&format=png&color=000000" alt="Twitter"></a> -->
             <table align="center" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <!-- Facebook -->
                <td align="center" width="36" height="36" style="padding:0 6px;">
                    <a href="#" target="_blank">
                       <img src="https://static.vecteezy.com/system/resources/previews/018/930/698/non_2x/facebook-logo-facebook-icon-transparent-free-png.png"
                         width="35" height="34" style="display:block;">
                    </a>
                </td>
                <!-- LinkedIn -->
                <td align="center" width="36" height="36" style="padding:0 6px;">
                    <a href="#" target="_blank">
                        <img src="https://cdn-icons-png.flaticon.com/512/3991/3991775.png"
                             width="20" height="20"
                             style="display:block;">
                    </a>
                </td>
                 <!-- Instagram -->
                <td align="center" width="36" height="36" style="padding:0 6px;">
                    <a href="#" target="_blank">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                             width="20" height="20"
                             style="display:block;">
                    </a>
                </td>
                <!-- X / Twitter -->
                <td align="center" width="36" height="36" style="padding:0 6px;">
                    <a href="#" target="_blank">
                        <img src="https://img.icons8.com/?size=100&id=ClbD5JTFM7FA&format=png&color=000000"
                             width="26" height="26"
                             style="display:block;">
                    </a>
                </td>
            </tr>
        </table>
        </td>
    </tr>
    <!-- App Download -->
    <tr >
        <td align="center" class="app-drawer" style="padding: 16px 0;">
            <p style="margin:0; color:#111827; font-size:0.9375rem; font-weight:500;">Get Our App From Here</p>
             <a href="https://apps.apple.com/np/app/my-palika/id6497230568"  title="App Store" target="_blank"><img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY_o-G9mMFogqWSeYzzRALpqqr8E-pvKn39w&s" alt="App Store" class="app-badge"></a>
            <a href="https://play.google.com/store/apps/details?id=com.cliffbyte.mypalika" title="Google Play" target="_blank"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSADMTEo4YEurEn-gXFBOfumKYAJMviq-T9ww&s" alt="Google Play" class="app-badge"></a>
        </td>
    </tr>
</table>
                        </div>
                        <!-- SOCIAL & FOOTER -->
                        <table width="100%" border="0" cellpadding="0" cellspacing="0" class="footer">
                            <tr>
                                <td>
                                    <p class="legal-text">
                                         <!-- <strong>Contact Us</strong><br> -->
                                         Phone: +977 9876543210<br>
                                         Email:
                                        <a href="mailto:support@palikaportal.com" style="color: #262D39;">
                                          support@palikaportal.com
                                        </a><br>
                                        Address: Bagmati, Kathmandu, Kathmandu Metropolitan<br><br>
                                       This email was generated automatically. For inquiries or assistance, please contact us.
<br>
                                        <a href="https://demo.palikaportal.com/privacy-policy" style="color: #262D39; text-decoration: underline;" title="Read our privacy policy" class="privacy-policy" target="_blank">Privacy Policy</a>
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </center>
    </div>
</body>
</html>`,
  };

  await transporter.sendMail(mailOptions);
};
