import bcrypt from 'bcrypt';
import { json } from '@remix-run/node';
import pool from '~/utils/db.server';

export const action = async ({ request }: { request: Request }) => {
    const formData = await request.formData();
    const enrollmentId = formData.get("userId") as string; //userId is the name for input field in sign in form
    const inputPassword = formData.get("password") as string;

    try {
        // Fetch the user based on enrollment_id
        const result = await pool.query('SELECT * FROM users WHERE enrollment_id = $1', [enrollmentId]);

        if (result.rowCount === 0) {
            return json({ error: 'User not found' }, { status: 404 });
        }

        const user = result.rows[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(inputPassword, user.password);

        if (!isPasswordValid) {
            return json({ error: 'Invalid password' }, { status: 401 });
        }

        // Generate and return token (this could be a JWT in a real-world app)
        const token = `token_for_user_${user.id}`;
        return json({ success: true, token }, { status: 200 });
    } catch (error) {
        console.error(error);
        return json({ error: 'Server error' }, { status: 500 });
    }
};