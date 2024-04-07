import Users from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const Register = async (req, res) => {
    console.log(req.body);
    const { name, email, password, confirmPassword } = req.body;

    if(password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const Login = async (req, res) => {
    try {
        
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });
 
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) {
            return res.status(400).json({ message: "Wrong Password" });
        }

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;

        const accessToken = jwt.sign({userId, name, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        })

        const refreshToken = jwt.sign({userId, name, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })

        await Users.update({refresh_token: refreshToken}, {
            where: {
                id: userId
            }
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // means expire in 1 day
        });

        res.json({ accessToken });

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}