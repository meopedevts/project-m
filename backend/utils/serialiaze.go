package utils

import "github.com/bytedance/sonic"

func Serialize(raw interface{}) ([]byte, error) {
	serialized, err := sonic.Marshal(raw)
	if err != nil {
		return nil, err
	}

	return serialized, nil
}
