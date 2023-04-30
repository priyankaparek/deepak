import UserModel from '../models/Users.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../middlewares/sendEmail.js'
import token from '../middlewares/token.js';


export const userRegistration = async (req, res) => {
    try {
        const { filename } = req.file
        const image = `${process.env.IMAGE_URL}/${filename}`
        const { name, email, password, password_confirmation, phoneNumber, country, state, company } = req.body
        const user = await UserModel.findOne({ email: email })
        if (user) {
            // Wrong down line  === right one is res.status(404).jscon({message:"user already exist"})
            res.status(206).json({ message: "user already exist" })
            //  res.status(206).json({"status": false, "message":"Email already exists"})
        } else {
            // if (name && email && password && password_confirmation && tc) { // We don't this one because on model we alreday say that all fields are requried
            if (password == password_confirmation) {
                try {
                    const hashPassword = bcrypt.hashSync(password, 8)
                    // After hasing password we have to add on database 

                    const user = new UserModel({
                        name: name,
                        email: email,
                        image: image,
                        password: hashPassword,
                        phoneNumber: phoneNumber,
                        country: country,
                        state: state,
                        company: company
                    })
                    await user.save()
                    const userid = user._id
                    res.clearCookie(`${userid}`)
                    req.cookies[`${userid}`] = ""
                    token(userid, 200, res)
                } catch (error) {
                    // same as upper one
                    res.status(206).json({ status: false, message: error.message })
                }
            } else {

                res.status(206).json({ status: false, message: "Password and confirmPassword doesn't match" })
            }
        }
    } catch (err) {
        res.status(500).json({ status: false, message: err.message })
    }
}




// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if (user) {
            const isMatch = bcrypt.compareSync(password, user.password)
            if (isMatch) {

                const userid = user._id
                res.clearCookie(`${userid}`)
                req.cookies[`${userid}`] = ""
                token(userid, 200, res)
            } else {
                res.status(206).json({ status: false, message: "Email or password is not valid" })
            }

        } else {

            res.status(206).json({ status: false, message: "You are not a Registered User" })
        }

    } catch (error) {

        res.status(206).json({ status: false, message: "Unable to Login" })
    }
}


// Verify and get token id of user by creaking cookie
export const verify = async (req, res, next) => {
    try {
        const cookie = req.headers.cookie

        if (!cookie) {
            return res.status(206).json({ status: false, message: "cookie not found" })
        }
        const token = cookie.split("=")[1]

        jwt.verify(String(token), process.env.jwt_secret, (error, user) => {
            if (error) {

                return res.status(206).json({ status: false, message: "token not found" })

            }
            else {
                req.user = user.id
                next()
            }
        })
    } catch (error) {

        res.status(206).json({ status: false, message: "Unable to Login" })
    }
}

// Searh users by token is
export const getUser = async (req, res) => {
    try {
        const userId = req.user
        const user = await UserModel.findById(userId, "-password")
        if (!user) {
            res.status(206).json({ status: false, message: "User not found" })
        }
        else {
            return res.status(200).json({ status: true, message: user })
        }
    }
    catch (error) {
        return res.status(206).json({ status: false, message: "token not found" })
    }

}

export const getAllUser = async (req, res) => {
    try {
        const userId = req.user
        const users = await UserModel.find({ _id: { $ne: userId } }).select([
            "name", "email", "phoneNumber", "country", "state", "company", "image"
        ]);
        if (!users) {
            return res.status(206).json({ message: " product not found" })
        } else {
            return res.status(200).json(users)
        }
    }
    catch (error) {
        return res.status(206).json({ status: false, message: error.message })
    }
}

// Budwak bhul gya
export const forgetPassword = async (req, res) => {
    try {

        const { email } = req.body
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(206).json({ success: false, message: "User not found", });
        }
        let otp = Math.floor(1000 + Math.random() * 9000);
        user.otp = otp
        await user.save();
        await sendEmail({ email: user.email, subject: "with this otp you can reset your password", message: `use this ${otp} to change your password` });
        res.status(200).json({ success: true, message: `Email sent to ${user.email}` });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}




// Logout
export const logout = async (req, res) => {
    try {
        const user = req.user

        if (!user) {
            return res.status(206).json({ failed: false, message: "user not found" });
        } else {
            res.clearCookie(`${user}`)
            req.cookies[`${user}`] = ""
            return res.status(206).json({ failed: false, message: "logout successful" })
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

// delete profile 
export const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params

        const user = await UserModel.findById(id)
        if (!user) {
            return res.status(206).json({ message: " No such user found" })

        }
        else {
            await user.deleteOne()
            return res.status(200).json({ message: " Profile deleted successfully" })
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

//profile update


export const profileUpdate = async (req, res) => {
    try {
        const newData = {
            name: req.body.name, phoneNumber: req.body.phoneNumber, company: req.body.company, country: req.body.country, state: req.body.state,
        }
        const userId = req.user
        const user = await UserModel.findById(userId)
        if (!user) {
            return res.status(206).json({ message: "user not found" })
        }
        else {
            const user = await UserModel.findByIdAndUpdate(userId, newData, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            })

            await user.save()
            return res.status(200).json({ success: true, message: "Profile Updated successfully" })
        }
    }

    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
export const verifyOtp = async (req, res) => {

    const { otp } = req.body
    if (!otp) {
        return res.status(206).json({ message: "otp invalid" })
    }
    const user = await UserModel.findOne({ otp })
    if (!user) {
        return res.status(206).json({ message: "user not found" })
    }
    const token = jwt.sign({ email: user.email }, process.env.jwt_secret, {
        expiresIn: "7d",
    });
    return res.status(200).json({ success: true, message: token })

}

export const confirmPasswordByOtp = async (req, res) => {
    const { password, confirmPassword, secrateKey } = req.body

    if (!secrateKey) {
        return res.status(206).json({ status: false, message: "token not found" })
    }


    jwt.verify(String(secrateKey), process.env.jwt_secret, async (error, data) => {

        if (error) {

            return res.status(206).json({ status: false, message: "User Not Found" })
        }
        else {
            const email = data.email

            if (password === confirmPassword) {
                const newPassword = bcrypt.hashSync(password, 8)
                const user = await UserModel.findOneAndUpdate({ email: email }, { $set: { password: newPassword } })

                await user.save()
                const userid = user._id
                res.clearCookie(`${userid}`)
                req.cookies[`${userid}`] = ""
                token(userid, 200, res)
            } else {
                return res.status(206).json({ status: false, message: "password not matched" })

            }
        }
    }
    )
}


export const resetPassword = async (req, res) => {
    try {
        const userId = req.user

        const { old_password, new_password, confirm_password } = req.body

        const user = await UserModel.findOne({ userId })

        if (!user) {
            return res.status(206).json({ success: false, message: 'user not found' })
        }
        else {
            const isMatch = bcrypt.hashSync(old_password, user.password)

            if (!isMatch) {
                return res.status(206).json({ success: false, message: 'user current password wrong' })
            } else {
                if (new_password === confirm_password) {
                    const password = bcrypt.hashSync(new_password, 8)
                    const users = await UserModel.updateOne({ _id: userId }, { $set: { password: password } }, {
                        new: true,
                        runValidators: true,
                        useFindAndModify: false

                    })
                    await users.save()
                    return res.status(200).json({ success: false, message: 'password changed successfully' })
                } else {
                    return res.status(206).json({ success: false, message: 'password not matched' })
                }
            }
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



export const updatePrfilePic = async (req, res) => {
    const { filename } = req.file
    const image = `${process.env.IMAGE_URL}/${filename}`
    const userId = req.user
    const user = await UserModel.findById(userId)
    if (!user) {
        return res.status(206).json({ message: "user not found" })
    }
    else {
        const user = await UserModel.findByIdAndUpdate(userId, { $set: { image: image } }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })
        await user.save()
        return res.status(200).json({ success: true, message: "Profile Pic  Updated" })
    }
}
