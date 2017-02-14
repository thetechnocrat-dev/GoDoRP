package main

import (
	"testing"
)

func TestCanary(t *testing.T) {
	expected := "godorp"
	actual := Canary("godorp")
	if expected != actual {
		t.Error("Canary test failed")
		t.Logf("expected %s, actual %s", expected, actual)
	}
}
