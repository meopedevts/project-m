package utils

import "fmt"

func GenerateAuthUrl(jtwToken string) string {
	baseUrl := "http://localhost:3000/auth/verify/"
	url := fmt.Sprintf("%s%s", baseUrl, jtwToken)
	return url
}
