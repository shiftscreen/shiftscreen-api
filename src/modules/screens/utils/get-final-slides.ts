import { getDeletedSlidesIds } from './get-deleted-slides-ids.util';
import { getUpdatedSlides } from './get-updated-slides.util';
import { Slide } from '../../slides/slides.entity';
import { SlideInput } from '../../slides/dto/slide.input';

export const getFinalSlides = (
  screenSlides: Slide[] | undefined,
  slidesInput: SlideInput[] | undefined
): [Slide[] | undefined, number[] | undefined] => {
  if (slidesInput === undefined) {
    return [undefined, undefined];
  }

  const deletedSlidesIds = getDeletedSlidesIds(screenSlides, slidesInput);
  const updatedSlides = getUpdatedSlides(screenSlides, slidesInput);
  const finalSlides = updatedSlides.filter(slide => !deletedSlidesIds.includes(slide.id));
  return [finalSlides, deletedSlidesIds];
};
