import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
    // return await bcrypt.hash(password, 10);
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    return  await bcrypt.hash(password, salt);
}

// import { createCookieSessionStorage, redirect } from "@remix-run/node";
// import bcrypt from "bcryptjs";
// import { db } from "./db.server";
//
// type LoginForm = {
//     enrollmentId: string;
//     password: string;
// };
//
// type RegisterForm = {
//     firstName: string;
//     lastName: string;
//     collegeName: string;
//     universityName: string;
//     enrollmentId: string;
//     collegeIdUrl: string | null;
//     city: string;
//     state: string;
//     password: string;
// };
//
// export async function register(user: RegisterForm) {
//     const passwordHash = await bcrypt.hash(user.password, 10);
//     try {
//         const newUser = await db.user.create({
//             data: {
//                 firstName: user.firstName,
//                 lastName: user.lastName,
//                 collegeName: user.collegeName,
//                 universityName: user.universityName,
//                 enrollmentId: user.enrollmentId,
//                 collegeIdUrl: user.collegeIdUrl,
//                 city: user.city,
//                 state: user.state,
//                 password: passwordHash,
//             },
//         });
//         return { success: true, user: { id: newUser.id, enrollmentId: user.enrollmentId } };
//     } catch (error) {
//         console.error("Registration error:", error);
//         return { success: false, error: "Error creating user" };
//     }
// }
//
// export async function login({ enrollmentId, password }: LoginForm) {
//     const user = await db.user.findUnique({
//         where: { enrollmentId },
//     });
//     if (!user) return null;
//
//     const isCorrectPassword = await bcrypt.compare(password, user.password);
//     if (!isCorrectPassword) return null;
//
//     return { id: user.id, enrollmentId };
// }
//
// const sessionSecret = process.env.SESSION_SECRET;
// if (!sessionSecret) {
//     throw new Error("SESSION_SECRET must be set");
// }
//
// const storage = createCookieSessionStorage({
//     cookie: {
//         name: "RJ_session",
//         secure: process.env.NODE_ENV === "production",
//         secrets: [sessionSecret],
//         sameSite: "lax",
//         path: "/",
//         maxAge: 60 * 60 * 24 * 30,
//         httpOnly: true,
//     },
// });
//
// export async function createUserSession(userId: string, redirectTo: string) {
//     const session = await storage.getSession();
//     session.set("userId", userId);
//     return redirect(redirectTo, {
//         headers: {
//             "Set-Cookie": await storage.commitSession(session),
//         },
//     });
// }
//
// export { storage };