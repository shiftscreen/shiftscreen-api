import { Slide } from '../../slides/slides.entity';
import { GraphQLError } from 'graphql';
import { ErrorsMessages } from '../../../constants';
import map = require('lodash/map');
import { createEntitiesInstancesArray } from '../../../shared/utils/create-entities-instances-array.util';
import { SlideInput } from '../../slides/dto/slide.input';


export const getUpdatedSlides = (oldSlides: Slide[], slidesInput: SlideInput[]): Slide[] => {
  const inputSlides = createEntitiesInstancesArray<Slide>(Slide, slidesInput);

  return inputSlides.length === 0
    ? oldSlides
    : mergeSlides(oldSlides, inputSlides);
};

export const mergeSlides = (oldSlides: Slide[], inputSlides: Slide[]): Slide[] => (
  map(inputSlides, (inputSlide: Slide): Slide => {
    const oldSlide = oldSlides.find((slide: Slide) => slide.id === inputSlide.id);

    if (!oldSlide && inputSlide.id !== undefined) {
      throw new GraphQLError(ErrorsMessages.WRONG_SLIDE_SCREEN)
    }

    return {
      ...!!oldSlide && oldSlide,
      ...inputSlide,
    };
  })
);
