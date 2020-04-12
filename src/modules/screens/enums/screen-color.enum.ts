import { registerEnumType } from 'type-graphql';

export enum ScreenColor {
  RED = "#e74c3c",
  GREEN = "#2ecc71",
  BLUE = "#3498db",
}

registerEnumType(ScreenColor, {
  name: 'ScreenColor'
});
