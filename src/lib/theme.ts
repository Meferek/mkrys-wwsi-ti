"use client";
import { createTheme } from "@mui/material/styles";

export default createTheme({
    palette: {
        
        mode: "light",

        primary: {
            main: "#5871e0",   // royal-blue-600
            light: "#88abf2",  // royal-blue-400
            dark:  "#384b99",  // royal-blue-800
            contrastText: "#ffffff",
        },

        secondary: {
            main: "#c707eb",   // fuchsia-pink-600
            light: "#f65cff",  // fuchsia-pink-400
            dark:  "#9400a9",  // fuchsia-pink-800
            contrastText: "#ffffff",
        },

        success: {
            main: "#529816",   // conifer-600
            light: "#9ade58",  // conifer-400
            dark:  "#345c14",  // conifer-800
            contrastText: "#0b0b0b",
        },

        warning: {
            main: "#aa8e29",   // wattle-600
            light: "#d5c741",  // wattle-400
            dark:  "#72551f",  // wattle-800
            contrastText: "#0b0b0b",
        },

        error: {
            main: "#c74430",   // burnt-sienna-600
            light: "#e07655",  // burnt-sienna-400
            dark:  "#872825",  // burnt-sienna-800
            contrastText: "#ffffff",
        },

        info: {
            main: "#875adc",   // fuchsia-blue-600
            light: "#aa96f0",  // fuchsia-blue-400
            dark:  "#5b30a7",  // fuchsia-blue-800
            contrastText: "#ffffff",
        },

        background: {
            default: "#f9fafb",
            paper: "#ffffff",
        },

        text: {
            primary: "#111827",
            secondary: "#4b5563",
        },
        divider: "#e5e7eb",
    },
    typography: {
        fontFamily:
        "var(--font-poppins), system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    },
    shape: { borderRadius: 10 },
    components: {
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    boxShadow: 'none',
                    overflow: 'hidden',
                    '&:before': {
                        display: 'none',
                    },
                    '&:not(:last-child)': {
                        marginBottom: '8px',
                    },
                    '&.Mui-expanded': {
                        margin: 0,
                        marginBottom: '8px',
                    },
                },
            },
        },
        MuiAccordionSummary: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    borderRadius: '12px 12px 0 0',
                    padding: '4px 16px',
                    minHeight: '56px !important',
                    '&.Mui-expanded': {
                        minHeight: '56px !important',
                        borderRadius: '12px 12px 0 0',
                        borderBottom: '1px solid rgba(0, 0, 0, 0.23)',
                    },
                },
                content: {
                    margin: '12px 0 !important',
                },
                expandIconWrapper: {
                    color: '#6b7280',
                    '&.Mui-expanded': {
                        transform: 'rotate(180deg)',
                    },
                },
            },
        },
        MuiAccordionDetails: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    borderRadius: '0 0 12px 12px',
                },
            },
        },
    },
});
