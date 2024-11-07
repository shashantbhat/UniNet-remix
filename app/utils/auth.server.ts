import bcrypt from "bcrypt";
import pool from "~/utils/db.server";

export async function hashPassword(password: string): Promise<string> {
    // return await bcrypt.hash(password, 10);
    const salt = await bcrypt.genSalt(10); // Generate salt with 10 rounds
    return  await bcrypt.hash(password, salt);
}

// app/services/auth.server.ts
import { Authenticator, AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { sessionStorage, User } from '~/utils/session.server';

// Create an instance of the authenticator, pass a Type, User,  with what
// strategies will return and will store in the session
const authenticator = new Authenticator<User | Error | null>(sessionStorage, {
  sessionKey: "sessionKey", // keep in sync
  sessionErrorKey: "sessionErrorKey", // keep in sync
});

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {

    // get the data from the form...
    let email = form.get('email') as string;
    let password = form.get('password') as string;

    // initiialize the user here
    let user = null;

    // do some validation, errors are in the sessionErrorKey
    if (!email || email?.length === 0) throw new AuthorizationError('Bad Credentials: Email is required')
    if (typeof email !== 'string')
      throw new AuthorizationError('Bad Credentials: Email must be a string')

    if (!password || password?.length === 0) throw new AuthorizationError('Bad Credentials: Password is required')
    if (typeof password !== 'string')
      throw new AuthorizationError('Bad Credentials: Password must be a string')

    // login the user, this could be whatever process you want


    // if (email === 'aaron@mail.com' && password === 'password') {
    //   user = {
    //     name: email,
    //     token: `${password}-${new Date().getTime()}`,
    //   };

    // // 11234 Check for username and password from the database from pool 
    


    //   // the type of this user must match the type you pass to the Authenticator
    //   // the strategy will automatically inherit the type if you instantiate
    //   // directly inside the `use` method
    //   return await Promise.resolve({ ...user });

    // } else {
    //   // if problem with user throw error AuthorizationError
    //   throw new AuthorizationError("Bad Credentials")
    // }
    // Hash the password before storing it
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash("yashdhingra", salt);
    // console.log(hashedPassword);
    // Check for username and password from the database using pool
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = res.rows[0];
      console.log(user);

      if (user && await bcrypt.compare(password, user.password_hash)) {
        return { name: user.name, token: `${user.id}-${new Date().getTime()}` };
      } else {
        throw new AuthorizationError("Bad Credentials");
      }
    } finally {
      client.release();
    }


  }),
);

export default authenticator