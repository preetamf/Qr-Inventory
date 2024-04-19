import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const userSchema = new Schema(
    {
        username: {
            type: String,
            require: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
}) // .pre middleware used to hash password every time when pasword feild updates or changes before saving in DB

//password validation
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

//jwt token generation:
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        //payload
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET, //secret token
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY //expiry
        }
    )
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sing(
        //payload
        {
            _id: this._id,
            email: this.email
        },
        process.env.REFRESH_TOKEN_SECRET, //secret token
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY // expiry
        }
    )
}

export const User = mongoose.model("User", userSchema)