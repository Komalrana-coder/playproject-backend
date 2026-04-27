import bcrypt from "bcrypt";
import { Request, Response } from "express";
import Employee from "../models/employee";
const jwt = require("jsonwebtoken");

export const employeeLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const employee = await Employee.findOne({email});
        if (!employee) {
            return res.status(400).json({ message: "invalid email or password"});
        }
        if (!employee.password) {
            return res.status(400).json({
                message: "Password not found"
            });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ message: "invalid email or password" });
        }
        const token = jwt.sign(
            {
                id: employee._id,
                email: employee.email
            },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );
        const employeeData = employee.toObject();
        delete employeeData.password;

        return res.status(200).json({
            message: "Login successful",
            user: employeeData,
            token
        });

    } catch (error: any) {
        console.log("Register Error:", error);


        return res.status(500).json({
            success:false,
            message: error.message
        });
    }
};