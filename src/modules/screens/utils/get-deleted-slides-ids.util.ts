import { Slide } from '../../slides/slides.entity';
import { SlideInput } from '../../slides/dto/slide.input';

export const getDeletedSlidesIds = (oldSlides: Slide[], inputSlides: SlideInput[]): number[] => {
  const oldSlidesIds = oldSlides.map(slide => slide.id);
  const inputSlidesIds = inputSlides.map(slideInput => slideInput.id);

  return inputSlidesIds.length === 0
    ? oldSlidesIds
    : oldSlidesIds.filter(id => !inputSlidesIds.includes(id));
};
