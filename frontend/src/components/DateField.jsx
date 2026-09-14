import { useRef } from "react";
import { TextField } from "@mui/material";

export default function DateField(props) {
    const inputRef = useRef(null);
    const openPicker = () => {
        const input = inputRef.current;
        if (!input || input.disabled || input.readOnly) return;
        input.focus();
        if (typeof input.showPicker === "function") {
            try {
                input.showPicker();
            } catch {
                // Keep manual entry available when the browser cannot open its picker.
                input.focus();
            }
        }
    };

    return <TextField {...props} type="date" inputRef={inputRef} onClick={openPicker} />;
}
