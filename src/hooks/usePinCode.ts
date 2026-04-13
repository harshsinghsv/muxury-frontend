import { useState, useCallback } from "react";
import { toast } from "sonner";

export const usePinCode = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [pinDetails, setPinDetails] = useState<{city: string, state: string} | null>(null);

    const validatePinCode = useCallback(async (pinCode: string) => {
        // Basic Length & Numeric check for Indian PIN
        if (!/^[1-9][0-9]{5}$/.test(pinCode)) {
            setPinDetails(null);
            return false;
        }

        setIsLoading(true);
        try {
            // Use India Post free public API
            const response = await fetch(`https://api.postalpincode.in/pincode/${pinCode}`);
            const data = await response.json();

            if (data && data[0] && data[0].Status === "Success") {
                const postOffice = data[0].PostOffice[0];
                setPinDetails({
                    city: postOffice.District,
                    state: postOffice.State
                });
                return true;
            } else {
                toast.error("Invalid PIN Code entered");
                setPinDetails(null);
                return false;
            }
        } catch (error) {
            console.error("PIN check failed", error);
            // Graceful fallback
            setPinDetails(null);
            return true;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { validatePinCode, pinDetails, isLoading };
};
