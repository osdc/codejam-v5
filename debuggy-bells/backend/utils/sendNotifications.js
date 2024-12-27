import Expense from "./../models/trackerModel.js";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function sendDailyNotifications() {
    try {
      const now = new Date();
      const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
      //  due within the next 24 hours and not notified
      const expenses = await Expense.find({
        dueDate: { $lte: next24Hours, $gte: now },
        notified: false,
      });
      for (const expense of expenses) {
        let msg;
        if (expense.sharedWith[0].type == "To be Given") {
          msg = {
            to: `${expense.userEmail}`,
            from: "abhijeetshukla.id@gmail.com",
            subject: "Expense Due Date Reminder",
            text: `Reminder: Your expense "${
              expense.title
            }" is due on ${expense.dueDate.toDateString()}.`,
            html: ` <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color:rgb(68, 162, 199);">Expense Due Date Reminder</h2>
        <p>Dear User,</p>
        <p>This is a friendly reminder that your expense titled <strong>"${
          expense.title
        }"</strong> of category: ${
              expense.category
            } is due on <strong>${expense.dueDate.toDateString()}</strong>.</p>
        <ul>
        <li>To be paid to ${expense.userEmail}</li>
        <li>Amount: ${expense.amount}</li>
        <li>Description: ${expense.description}</li>
        </ul>
        <p>Please take the necessary action before the due date to avoid any inconvenience.</p>
        <p><strong>Save your Expense Score!</strong></p>
        <hr />
        <p style="font-size: 0.9em; color: #666;">If you have any questions, feel free to contact us at support@example.com.</p>
      </div>`,
          };
        } else {
          msg = {
            to: `${expense.sharedWith[0].email}`,
            from: "abhijeetshukla.id@gmail.com",
            subject: "Expense Due Date Reminder",
            text: `Reminder: Your expense "${
              expense.title
            }" is due on ${expense.dueDate.toDateString()}.`,
            html: ` <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color:rgb(68, 162, 199);">Expense Due Date Reminder</h2>
        <p>Dear User,</p>
        <p>This is a friendly reminder that your expense titled <strong>"${
          expense.title
        }"</strong> of category: ${
              expense.category
            } is due on <strong>${expense.dueDate.toDateString()}</strong>.</p>
        <ul>
        <li>To be paid to ${expense.userEmail}</li>
        <li>Amount: ${expense.amount}</li>
        <li>Description: ${expense.description}</li>
        </ul>
        <p>Please take the necessary action before the due date to avoid any inconvenience.</p>
        <p><strong>Save your Expense Score!</strong>From Jingle Spend, Team Debuggy Bells</p>
        <hr />
        <p style="font-size: 0.9em; color: #666;">If you have any questions, feel free to contact us at support@example.com.</p>
      </div>`,
          };
        }
        try {
          // console.log({ msg });
          sgMail
            .send(msg)
            .then((response) => {
              console.log(response[0].statusCode);
              console.log(response[0].headers);
            })
            .catch((error) => {
              console.error(error);
            });
          expense.notified = true;
          await expense.save();
  
          console.log(
            `Notification sent for expense: ${expense.title}, ${expense.userEmail},${expense.sharedWith[0].email}`
          );
        } catch (err) {
          console.log(err);
        }
      }
    } catch (error) {
      console.error("Error sending daily notifications:", error);
    }
  }