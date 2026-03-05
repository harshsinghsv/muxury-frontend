export const icons = {
    dashboard: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    products: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
    orders: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 9 5a2 2 0 0 1-2-2h-2a2 2 0 0 1-2 2 M12 12h.01 M12 16h.01",
    users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
    analytics: "M18 20V10 M12 20V4 M6 20v-6",
    categories: "M4 6h16M4 12h16M4 18h16",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
    plus: "M12 5v14 M5 12h14",
    edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
    trash: "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
    search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
    chevDown: "M6 9l6 6 6-6",
    chevRight: "M9 18l6-6-6-6",
    x: "M18 6L6 18 M6 6l12 12",
    check: "M20 6L9 17l-5-5",
    tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
    image: "M21 15l-5-5L5 21 M1 1h22v22H1z M8.5 8.5a2 2 0 1 0 4 0 2 2 0 0 0-4 0",
    package: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    rupee: "M6 3h12 M6 8h12 M6 13l8.5 8 M6 13h3a4 4 0 0 0 0-8",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
    filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    trending: "M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6",
    settings: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 8v4 M12 16h.01",
    menu: "M3 12h18M3 6h18M3 18h18"
};

interface IconProps {
    d: string;
    size?: number;
    stroke?: string;
    fill?: string;
    sw?: number;
    className?: string;
}

export const AdminIcon = ({ d, size = 20, stroke = "#343434", fill = "none", sw = 1.8, className = "" }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d={d} />
    </svg>
);
