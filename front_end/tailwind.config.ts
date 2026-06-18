import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      '4sm': '280px',
      '2sm': '420px',
      '1sm': '480px',
      sm: '640px',
      md: '768px',
      '2md': '960px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      fontFamily: {
        Dana: 'Dana',
        DanaMedium: 'Dana Medium',
        DanaDemiBold: 'Dana Bold',
        DanaExtraLight: 'Dana ExtraLight',
        DanaExtraBold: 'Dana ExtraBold',
        DanaFaNumExtraBold: 'DanaFaNum ExtraBold',
        DanaFaNumMed: 'DanaFaNum Med',
      },
      backgroundColor: {
        btn: '#496CFC',
        icon: '#77A4FB',
        whiteColor: '#FFFFFF',
        title: '#2A2D53',
        primary: '#EF4056',
        // primary: '#061C3E',
      },
      colors: {
        title: '#2A2D53',
        main: '#151515',
        titleDescription: '#3E434D',
        des: '#3F4264',
        cblack: '#151515',
      },
      container: {
        center: true,
      },
    },
  },

  plugins: [],
};

export default config;
