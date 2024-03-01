package utils

import (
	"fmt"
	"log"

	"github.com/meopedevts/project-m/types"
	"gopkg.in/gomail.v2"
)

func SendEmail(emailData types.EmailData) {
	msg := gomail.NewMessage()
	msg.SetHeader("From", "marcelo.meope@gmail.com")
	msg.SetHeader("To", emailData.To)
	msg.SetHeader("Subject", "Confirmação de Login - Project M")
	msg.SetBody("text/html", fmt.Sprintf(`
	<!DOCTYPE html>
	<html lang="en">
	<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Confirmação de Login</title>
	</head>
	<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
	
			<div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 10px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
					<h1 style="text-align: center; color: #333;">Confirmação de Login</h1>
					<p style="text-align: center; color: #555;">Olá %s,</p>
					<p style="text-align: center; color: #555;">Você solicitou um link para fazer login na nossa plataforma. Clique no botão abaixo para acessar sua conta:</p>
					<div style="text-align: center; margin-top: 30px;">
							<a href="%s" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Acessar Minha Conta</a>
					</div>
					<p style="text-align: center; color: #555;">Se você não solicitou este login, ignore este email.</p>
			</div>
	
	</body>
	</html>	
	`, emailData.Username, emailData.Url))

	dialer := gomail.NewDialer("smtp.gmail.com", 587, "marcelo.meope@gmail.com", "xpee fzwh pvph jylu")

	if err := dialer.DialAndSend(msg); err != nil {
		log.Fatal("Erro durante o envio do email.")
	}
}
