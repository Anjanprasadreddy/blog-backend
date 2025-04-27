## First run npm init 

## Run "npm start" to run backend code.

## make sure that you update these values( user ans pass) in sendMail function
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'youremail@gmail.com', // your email
      pass: 'apppassword',   // your app-specific password (NOT normal Gmail password)
    },
  });


