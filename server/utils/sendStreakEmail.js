// utils/sendStreakEmail.js
const nodemailer = require("nodemailer");
const { GMAIL_USER, GMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

function buildStreakEmailTemplate(user, tasks) {
  const rows = tasks
    .map(
      (t) => `
      <tr>
        <td style="padding:8px;border:1px solid #ddd;">${t.name} 🔥</td>
        <td style="padding:8px;border:1px solid #ddd;text-align:center;">${t.streak}</td>
      </tr>`
    )
    .join("");

  const quote = "“The secret of your future is hidden in your daily routine.”";

  return `
  <!DOCTYPE html>
  <html><head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <title>Your Streak Summary</title>
  </head><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
    <table width="100%"><tr><td align="center">
      <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;">
        <tr style="background:#272c3f;color:#fff;">
          <td style="padding:20px;text-align:center;font-size:24px;">
            Hi ${user.name}, here’s your daily streak summary!
          </td>
        </tr>
        <tr><td style="padding:20px;">
          <table width="100%" style="border-collapse:collapse;">
            <thead>
              <tr>
                <th style="padding:8px;border:1px solid #ddd;text-align:left;">Task</th>
                <th style="padding:8px;border:1px solid #ddd;text-align:center;">Streak</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
          <p style="font-style:italic;margin-top:20px;">${quote}</p>
          <div style="text-align:center;margin:30px 0;">
            <a href="https://streakspark.netlify.app/app"
               style="background:#e94e77;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;">
              View Your Streaks
            </a>
          </div>
        </td></tr>
        <tr style="background:#272c3f;color:#bbb;">
          <td style="padding:15px;text-align:center;font-size:12px;">
            You’re receiving this because you enabled daily streak emails.
            <a href="https://streakspark.netlify.app/app/settings" style="color:#fff;text-decoration:underline;">Manage Preferences</a>
          </td>
        </tr>
      </table>
    </td></tr></table>
  </body></html>
  `;
}

async function sendStreakEmail(user, tasks) {
  const html = buildStreakEmailTemplate(user, tasks);
  try {
    await transporter.sendMail({
      from: `StreakSpark <${GMAIL_USER}>`,
      to: user.email,
      subject: "🔥 Your Daily StreakSpark Summary!",
      html,
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

module.exports = { sendStreakEmail };
