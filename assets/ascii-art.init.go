package assets

import "io/ioutil"

func Cat() string {
	art, err := ioutil.ReadFile("assets/ascii-art.txt")
	if err != nil {
		panic("[ERROR] [Cat - Generate Cat ASCII Art]")
	}

	return string(art)
}
