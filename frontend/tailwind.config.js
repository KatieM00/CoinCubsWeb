import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                },
                success: {
                    DEFAULT: 'oklch(var(--success) / <alpha-value>)',
                    foreground: 'oklch(var(--success-foreground))'
                },
                warning: {
                    DEFAULT: 'oklch(var(--warning) / <alpha-value>)',
                    foreground: 'oklch(var(--warning-foreground))'
                },
                popover: {
                    DEFAULT: 'oklch(var(--popover))',
                    foreground: 'oklch(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'oklch(var(--card))',
                    foreground: 'oklch(var(--card-foreground))'
                },
                chart: {
                    1: 'oklch(var(--chart-1))',
                    2: 'oklch(var(--chart-2))',
                    3: 'oklch(var(--chart-3))',
                    4: 'oklch(var(--chart-4))',
                    5: 'oklch(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'oklch(var(--sidebar))',
                    foreground: 'oklch(var(--sidebar-foreground))',
                    primary: 'oklch(var(--sidebar-primary))',
                    'primary-foreground': 'oklch(var(--sidebar-primary-foreground))',
                    accent: 'oklch(var(--sidebar-accent))',
                    'accent-foreground': 'oklch(var(--sidebar-accent-foreground))',
                    border: 'oklch(var(--sidebar-border))',
                    ring: 'oklch(var(--sidebar-ring))'
                },
                // CoinCubs specific colors
                purple: {
                    50: 'oklch(0.97 0.02 270)',
                    100: 'oklch(0.94 0.05 270)',
                    200: 'oklch(0.88 0.10 270)',
                    300: 'oklch(0.80 0.15 270)',
                    400: 'oklch(0.70 0.20 270)',
                    500: 'oklch(0.60 0.24 270)', // #7C3AED
                    600: 'oklch(0.50 0.22 270)',
                    700: 'oklch(0.40 0.18 270)',
                    800: 'oklch(0.30 0.14 270)',
                    900: 'oklch(0.20 0.10 270)',
                },
                blue: {
                    50: 'oklch(0.97 0.02 250)',
                    100: 'oklch(0.94 0.05 250)',
                    200: 'oklch(0.88 0.10 250)',
                    300: 'oklch(0.80 0.15 250)',
                    400: 'oklch(0.70 0.18 250)',
                    500: 'oklch(0.65 0.20 250)', // #3B82F6
                    600: 'oklch(0.55 0.18 250)',
                    700: 'oklch(0.45 0.16 250)',
                    800: 'oklch(0.35 0.12 250)',
                    900: 'oklch(0.25 0.08 250)',
                },
                gold: {
                    50: 'oklch(0.97 0.02 45)',
                    100: 'oklch(0.94 0.05 45)',
                    200: 'oklch(0.88 0.10 45)',
                    300: 'oklch(0.82 0.14 45)',
                    400: 'oklch(0.78 0.16 45)',
                    500: 'oklch(0.75 0.18 45)', // #F59E0B
                    600: 'oklch(0.68 0.16 45)',
                    700: 'oklch(0.58 0.14 45)',
                    800: 'oklch(0.48 0.12 45)',
                    900: 'oklch(0.38 0.10 45)',
                },
                green: {
                    50: 'oklch(0.97 0.02 150)',
                    100: 'oklch(0.94 0.05 150)',
                    200: 'oklch(0.88 0.10 150)',
                    300: 'oklch(0.80 0.14 150)',
                    400: 'oklch(0.72 0.16 150)',
                    500: 'oklch(0.65 0.18 150)', // #10B981
                    600: 'oklch(0.55 0.16 150)',
                    700: 'oklch(0.45 0.14 150)',
                    800: 'oklch(0.35 0.12 150)',
                    900: 'oklch(0.25 0.10 150)',
                },
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'calc(var(--radius) + 4px)',
                '2xl': 'calc(var(--radius) + 8px)',
                '3xl': 'calc(var(--radius) + 12px)',
            },
            boxShadow: {
                xs: '0 1px 2px 0 rgba(0,0,0,0.05)',
                soft: '0 2px 8px rgba(0,0,0,0.08)',
                warm: '0 4px 16px rgba(245, 158, 11, 0.15)',
                purple: '0 4px 16px rgba(124, 58, 237, 0.15)',
                blue: '0 4px 16px rgba(59, 130, 246, 0.15)',
            },
            fontFamily: {
                sans: ['Inter', 'Nunito', 'system-ui', 'sans-serif'],
                display: ['Poppins', 'Nunito', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'display-hero': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '1.1' }],
                'display-title': ['clamp(2rem, 5vw, 5rem)', { lineHeight: '1.2' }],
                'display-text': ['clamp(1.5rem, 3vw, 3rem)', { lineHeight: '1.4' }],
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'counter-up': {
                    from: { transform: 'translateY(10px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' }
                },
                'progress-fill': {
                    from: { width: '0' }
                },
                'confetti-fall': {
                    '0%': { transform: 'translateY(-100%) rotate(0deg)', opacity: '1' },
                    '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' }
                },
                'gentle-pulse': {
                    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.05)', opacity: '0.9' }
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' }
                },
                'slide-in-from-top': {
                    from: { transform: 'translateY(-10px)', opacity: '0' },
                    to: { transform: 'translateY(0)', opacity: '1' }
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'counter-up': 'counter-up 0.5s ease-out',
                'progress-fill': 'progress-fill 1s ease-out',
                'confetti': 'confetti-fall 3s ease-in-out infinite',
                'gentle-pulse': 'gentle-pulse 2s ease-in-out infinite',
                'fade-in': 'fade-in 0.3s ease-out',
                'slide-in-from-top': 'slide-in-from-top 0.3s ease-out',
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
