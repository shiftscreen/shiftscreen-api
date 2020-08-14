import { registerEnumType } from 'type-graphql';

export enum PredefinedQuotesType {
  Motivational,
  Bussiness,
}

registerEnumType(PredefinedQuotesType, {
  name: 'PredefinedQuotesType'
});
