import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({service: "gmail", 
                                           host: "smtp.gmail.com", 
                                           port: 465, 
                                           secure: true, 
                                           auth: {user: "tomstrattoria@gmail.com", pass: "eras sose cwas ukjy"}});

const message = `
<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<p>Hello World</p>

</body>
</html>`;
const options = {from: "tomstrattoria@gmail.com", to: "thomasw2701@gmail.com", subject: "Email Test", html: message};
mailer.sendMail(options, (error, info) => {
    if (error) {
        console.error(error);
    } else {
        console.log(info.response);
    }
});