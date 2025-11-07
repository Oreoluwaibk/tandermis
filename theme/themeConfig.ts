import type { ThemeConfig } from 'antd';

export const theme: ThemeConfig = {
  token: {
    colorPrimary: '#121212',
    colorPrimaryBg: "#fff",
    fontFamily: '"Geist", "Geist Fallback"',
  },
  components: {
    Input: {
      colorTextPlaceholder: "#6B6B6B",
      fontSizeLG: 14,
      colorBorder: "#C4C4C4",
      controlHeightLG: 44,
      borderRadius: 30,
      borderRadiusLG:5,
      colorBgContainer: "#F5F5F5"
    },
    InputNumber: {
      colorTextPlaceholder: "#6B6B6B",
      fontSizeLG: 14,
      colorBorder: "#C4C4C4",
      controlHeightLG: 44,
      borderRadius: 5,
      borderRadiusLG:5,
      colorBgContainer: "#F5F5F5",
    },
    DatePicker: {
      colorTextPlaceholder: "#888888",
      colorBorder: "#C4C4C4",
      controlHeight: 44,
      borderRadius: 40,
      fontSize: 14,
    },
    Select: {
      colorTextPlaceholder: "#888888",
      colorBorder: "#C4C4C4",
      controlHeight: 44,
      borderRadius: 40,
      fontSize: 14,
    },
    Form: {
      labelColor: "#191919",
      labelFontSize: 14,
    },
    Button: {
      borderRadius: 40,
      controlHeight: 48
    },
    Upload:{
      fontSize:14
    },
    Card: {
      borderRadius: 40
    }
  }
};
