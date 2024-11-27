## Authentication Routes

/auth/login -> Login Form
/auth/register -> Registration Form

/auth/confirm-email -> Email verification warning after registering a new account
/auth/confirm-email/verify?token={token} -> Email verification for an account that uses non-google authentication

/auth/reset-password -> Email input and reset email confirmation warning when reseting password
/auth/reset-password/reset?token={token} -> Validating token from email confirmation and input a new password
