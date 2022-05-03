import React from 'react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import { PartialTheme, ThemeProvider } from '@fluentui/react';
import korean from './i18n/korean.json';
import { IntlProvider } from 'react-intl';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Calculator from './pages/Calculator';

const appTheme: PartialTheme = {
  palette: {},
};

const App: React.FC = () => {
  initializeIcons();

  return (
    <IntlProvider messages={korean} locale="ko" defaultLocale="ko">
      <ThemeProvider theme={appTheme}>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <Routes>
            <Route path="/" element={<Calculator />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </IntlProvider>
  );
};

export default App;
