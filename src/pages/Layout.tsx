import styled from '@emotion/styled';
import { uiPrimaryFont } from '../design/color';

export const StyledDivPageBox = styled.div`
  width: 100vw;
  height: 100vh;
`;

export const StyledDivPageHeading = styled.div`
  width: 100vw;
  height: 30px;
  box-shadow: ${uiPrimaryFont.lighten(0.7).alpha(0.8).toString()} 0px 3px 8px;
`;

export const StyledDivPageBody = styled.div`
  width: 100vw;
  height: calc(100vh - 60px);
`;
