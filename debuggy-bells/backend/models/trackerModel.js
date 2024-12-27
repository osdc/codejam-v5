import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address",
        ],
    },
    title: {
        type: String,
        required: [true, "Expense title is required"],
        trim: true,
        maxlength: 100,
    },
    amount: {
        type: Number,
        required: [true, "Expense amount is required"],
        min: [0, "Amount cannot be negative"],
    },
    category: {
        type: String,
        required: [true, "Expense category is required"],
        enum: ["Cafe Food", "Ordered Food", "Outside Food", "Groceries", "Munchies", "Other"]
        
    },
    typeN: {
        type: String,
        enum: ["Naughty", "Nice"],
        required: true,
      },
    date: {     //expensed at
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required:true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500,
    },
    notified:{
        type: Boolean,
        default:false
    },
    sharedWith: [
        {
            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
                match: [
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    "Please provide a valid email address",
                ],
            },
            amount: {
                type: Number,
                required: true,
                min: [0, "Shared amount cannot be negative"],
            },
            status: {
                type: String,
                enum: ["Pending", "Settled"],
                default: "Pending",
            },
            type: {
                type: String,
                enum: ["To be Taken", "To be Given"], // Specifies the direction of the transaction
                required: true,
            },
        },
    ],
}, {
    timestamps: true,
});

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;
