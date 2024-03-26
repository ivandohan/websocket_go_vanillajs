package ws

import (
	"context"
	"github.com/google/uuid"
	"time"
)

type OTP struct {
	Key       string
	CreatedAt time.Time
}

type RetentionMap map[string]OTP

func NewRetentionMap(ctx context.Context, retentionPeriod time.Duration) RetentionMap {
	rm := make(RetentionMap)

	go rm.Retention(ctx, retentionPeriod)

	return rm
}

func (rm RetentionMap) Retention(ctx context.Context, retentionPeriod time.Duration) {
	ticker := time.NewTicker(400 * time.Millisecond)

	for {
		select {
		case <-ticker.C:
			for _, otp := range rm {
				if otp.CreatedAt.Add(retentionPeriod).Before(time.Now()) {
					delete(rm, otp.Key)
				}
			}
		case <-ctx.Done():
			return
		}
	}
}

func (rm RetentionMap) NewOTP() OTP {
	otp := OTP{
		Key:       uuid.NewString(),
		CreatedAt: time.Now(),
	}

	rm[otp.Key] = otp

	return otp
}

func (rm RetentionMap) VerifyOTP(otpKey string) bool {
	if _, ok := rm[otpKey]; !ok {
		return false
	}

	delete(rm, otpKey)

	return true
}
