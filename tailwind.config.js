module.exports = {
  content: ["./pages/*.{html,js}", "./index.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F0F4F5", // primary-50
          100: "#D6E3E6", // primary-100
          200: "#ADC7CD", // primary-200
          300: "#84ABB4", // primary-300
          400: "#5B8F9B", // primary-400
          500: "#1B4B5A", // primary-500 (main)
          600: "#164248", // primary-600
          700: "#113236", // primary-700
          800: "#0C2124", // primary-800
          900: "#071112", // primary-900
          DEFAULT: "#1B4B5A", // Deep Caribbean authority
        },
        secondary: {
          50: "#FDF5F0", // secondary-50
          100: "#F9E6D6", // secondary-100
          200: "#F3CDAD", // secondary-200
          300: "#EDB484", // secondary-300
          400: "#E79B5B", // secondary-400
          500: "#D4772B", // secondary-500 (main)
          600: "#B86324", // secondary-600
          700: "#9C4F1D", // secondary-700
          800: "#803B16", // secondary-800
          900: "#64270F", // secondary-900
          DEFAULT: "#D4772B", // Sunset warmth
        },
        accent: {
          50: "#FEFBF2", // accent-50
          100: "#FDF4D9", // accent-100
          200: "#FBE9B3", // accent-200
          300: "#F9DE8D", // accent-300
          400: "#F7D367", // accent-400
          500: "#E8B931", // accent-500 (main)
          600: "#D4A52A", // accent-600
          700: "#C09123", // accent-700
          800: "#AC7D1C", // accent-800
          900: "#986915", // accent-900
          DEFAULT: "#E8B931", // Golden highlights
        },
        background: "#FEFCF8", // Warm canvas
        surface: "#F5F2ED", // Subtle depth
        text: {
          primary: "#2C3E35", // Extended reading
          secondary: "#6B7B73", // Clear hierarchy
        },
        success: {
          50: "#F2F7F4", // success-50
          100: "#D9E8DD", // success-100
          200: "#B3D1BB", // success-200
          300: "#8DBA99", // success-300
          400: "#67A377", // success-400
          500: "#4A7C59", // success-500 (main)
          600: "#3F6A4C", // success-600
          700: "#34583F", // success-700
          800: "#294632", // success-800
          900: "#1E3425", // success-900
          DEFAULT: "#4A7C59", // Order confirmation
        },
        warning: {
          50: "#FDFAF0", // warning-50
          100: "#F9F0D1", // warning-100
          200: "#F3E1A3", // warning-200
          300: "#EDD275", // warning-300
          400: "#E7C347", // warning-400
          500: "#B8860B", // warning-500 (main)
          600: "#A0750A", // warning-600
          700: "#886408", // warning-700
          800: "#705307", // warning-800
          900: "#584205", // warning-900
          DEFAULT: "#B8860B", // Inventory alerts
        },
        error: {
          50: "#FAF4F1", // error-50
          100: "#F1E0D6", // error-100
          200: "#E3C1AD", // error-200
          300: "#D5A284", // error-300
          400: "#C7835B", // error-400
          500: "#A0522D", // error-500 (main)
          600: "#8A4627", // error-600
          700: "#743A21", // error-700
          800: "#5E2E1B", // error-800
          900: "#482215", // error-900
          DEFAULT: "#A0522D", // Gentle correction
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        accent: ['Dancing Script', 'cursive'],
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        card: '0 4px 12px rgba(27, 75, 90, 0.1)',
        button: '0 2px 8px rgba(27, 75, 90, 0.15)',
        hover: '0 6px 16px rgba(27, 75, 90, 0.12)',
      },
      transitionDuration: {
        default: '300ms',
        page: '400ms',
      },
      transitionTimingFunction: {
        'ease-out': 'ease-out',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}