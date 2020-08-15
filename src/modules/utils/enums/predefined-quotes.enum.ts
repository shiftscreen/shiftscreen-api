import { registerEnumType } from 'type-graphql';

export enum PredefinedQuotesType {
  Motivational,
  Business,
}

registerEnumType(PredefinedQuotesType, {
  name: 'PredefinedQuotesType'
});
