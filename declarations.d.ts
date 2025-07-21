declare module '*.webp' {
  import {ImageSourcePropType} from 'react-native';
  const value: ImageSourcePropType;
  export default value;
}

declare module '*.html' {
  const html: string;
  export default html;
};
