// controllers/feedbackController.js
const Feedback = require("../models/feedbackModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function buildFeedbackEmailTemplate(feedback) {
  return `
  <!DOCTYPE html>
  <html><head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
    <title>New Feedback Received</title>
  </head><body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;">
    <table width="100%"><tr><td align="center">
      <table width="600" style="background:#fff;border-radius:8px;overflow:hidden;">
        <tr style="background:#272c3f;color:#fff;">
          <td style="padding:20px;text-align:center;font-size:24px;">
            New Feedback Received!
          </td>
        </tr>
        <tr><td style="padding:20px;">
          <table width="100%" style="border-collapse:collapse;">
            <tr>
              <td style="padding:8px;border:1px solid #ddd;"><strong>Name:</strong></td>
              <td style="padding:8px;border:1px solid #ddd;">${
                feedback.name || "Anonymous"
              }</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding:8px;border:1px solid #ddd;">${
                feedback.email
              }</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #ddd;"><strong>Type:</strong></td>
              <td style="padding:8px;border:1px solid #ddd;">${
                feedback.type
              }</td>
            </tr>
            <tr>
              <td style="padding:8px;border:1px solid #ddd;"><strong>Message:</strong></td>
              <td style="padding:8px;border:1px solid #ddd;">${
                feedback.message
              }</td>
            </tr>
          </table>
        </td></tr>
        <tr style="background:#272c3f;color:#bbb;">
          <td style="padding:15px;text-align:center;font-size:12px;">
            This is a feedback notification from StreakSpark
          </td>
        </tr>
      </table>
    </td></tr></table>
  </body></html>
  `;
}

exports.submitFeedback = async (req, res) => {
  try {
    const { name, email, type, message } = req.body;

    // Save to database
    const feedback = await Feedback.create({
      name,
      email,
      type,
      message,
    });

    // Send email notification
    try {
      const html = buildFeedbackEmailTemplate(feedback);
      await transporter.sendMail({
        from: `StreakSpark <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER, // Send to yourself
        subject: `🔔 New Feedback - ${type}`,
        html,
      });
      console.log(`✅ Feedback email sent successfully`);
    } catch (emailError) {
      console.error("❌ Feedback email failed:", emailError);
    }

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.error("Feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};
