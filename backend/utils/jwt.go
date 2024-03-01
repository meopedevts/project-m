package utils

import (
	"github.com/golang-jwt/jwt"
	"github.com/meopedevts/project-m/types"
)

func GenerateJWT(jwtPayload types.JWTPayload) (string, error) {
	secret := "650484b039757995404f2b1f30fca483"

	claims := jwt.MapClaims{
		"id":         jwtPayload.UserId,
		"username":   jwtPayload.Username,
		"email":      jwtPayload.Email,
		"expires_at": jwtPayload.ExpiresAt,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
