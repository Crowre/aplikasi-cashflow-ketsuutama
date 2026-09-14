import { useRef } from "react";
import { TextField } from "@mui/material";

export default function MonthField(props) {
    const inputRef = useRef(null);
    const openPicker = () => {
        const input = inputRef.current;
        if (input && typeof input.showPicker === "function") {
            try { input.showPicker(); } catch { input.focus(); }
        }
    };
    return <TextField {...props} inputRef={inputRef} onClick={openPicker} />;
}
